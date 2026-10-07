-- ICS quiz aggregate statistics for a public, static site.
-- Run this once in Supabase Dashboard -> SQL Editor.

create schema if not exists private;

create table if not exists public.ics_question_stats (
  question_id text primary key,
  total_answers bigint not null default 0 check (total_answers >= 0),
  correct_answers bigint not null default 0 check (correct_answers >= 0 and correct_answers <= total_answers),
  option_counts jsonb not null default '{}'::jsonb check (jsonb_typeof(option_counts) = 'object'),
  updated_at timestamptz not null default now()
);

create table if not exists public.ics_answer_receipts (
  question_id text not null,
  visitor_id uuid not null,
  selected_options text[] not null default '{}'::text[],
  is_correct boolean not null,
  created_at timestamptz not null default now(),
  primary key (question_id, visitor_id)
);

alter table public.ics_question_stats enable row level security;
alter table public.ics_answer_receipts enable row level security;

revoke all on table public.ics_question_stats from anon, authenticated;
revoke all on table public.ics_answer_receipts from anon, authenticated;
grant select on table public.ics_question_stats to anon, authenticated;

drop policy if exists "Public can read ICS aggregate stats" on public.ics_question_stats;
create policy "Public can read ICS aggregate stats"
  on public.ics_question_stats
  for select
  to anon, authenticated
  using (true);

create or replace function private.record_ics_answer_internal(
  p_question_id text,
  p_visitor_id uuid,
  p_selected_options text[],
  p_is_correct boolean
)
returns setof public.ics_question_stats
language plpgsql
security definer
set search_path = ''
as $$
declare
  v_inserted integer := 0;
  v_option text;
begin
  if p_question_id is null or p_question_id !~ '^q-[a-f0-9]{8,64}$' then
    raise exception 'invalid question id';
  end if;
  if p_visitor_id is null then
    raise exception 'visitor id is required';
  end if;
  if cardinality(coalesce(p_selected_options, '{}'::text[])) > 8 or exists (
    select 1
    from unnest(coalesce(p_selected_options, '{}'::text[])) as selected(option_value)
    where selected.option_value !~ '^[A-H]$'
  ) then
    raise exception 'invalid selected options';
  end if;

  insert into public.ics_answer_receipts (
    question_id, visitor_id, selected_options, is_correct
  ) values (
    p_question_id,
    p_visitor_id,
    coalesce(p_selected_options, '{}'::text[]),
    p_is_correct
  )
  on conflict (question_id, visitor_id) do nothing;
  get diagnostics v_inserted = row_count;

  if v_inserted > 0 then
    insert into public.ics_question_stats (
      question_id, total_answers, correct_answers, option_counts, updated_at
    ) values (
      p_question_id, 1, case when p_is_correct then 1 else 0 end, '{}'::jsonb, now()
    )
    on conflict (question_id) do update set
      total_answers = public.ics_question_stats.total_answers + 1,
      correct_answers = public.ics_question_stats.correct_answers + case when p_is_correct then 1 else 0 end,
      updated_at = now();

    foreach v_option in array coalesce(p_selected_options, '{}'::text[])
    loop
      update public.ics_question_stats
      set option_counts = jsonb_set(
        option_counts,
        array[v_option],
        to_jsonb(coalesce((option_counts ->> v_option)::bigint, 0) + 1),
        true
      )
      where question_id = p_question_id;
    end loop;
  end if;

  return query
    select stats.*
    from public.ics_question_stats as stats
    where stats.question_id = p_question_id;
end;
$$;

revoke execute on function private.record_ics_answer_internal(text, uuid, text[], boolean) from public;
revoke execute on function private.record_ics_answer_internal(text, uuid, text[], boolean) from anon, authenticated;
grant usage on schema private to anon, authenticated;
grant execute on function private.record_ics_answer_internal(text, uuid, text[], boolean) to anon, authenticated;

create or replace function public.record_ics_answer(
  p_question_id text,
  p_visitor_id uuid,
  p_selected_options text[],
  p_is_correct boolean
)
returns setof public.ics_question_stats
language sql
security invoker
set search_path = ''
as $$
  select *
  from private.record_ics_answer_internal(
    p_question_id,
    p_visitor_id,
    p_selected_options,
    p_is_correct
  );
$$;

revoke execute on function public.record_ics_answer(text, uuid, text[], boolean) from public;
revoke execute on function public.record_ics_answer(text, uuid, text[], boolean) from anon, authenticated;
grant execute on function public.record_ics_answer(text, uuid, text[], boolean) to anon, authenticated;

do $$
begin
  if not exists (
    select 1
    from pg_catalog.pg_publication_tables
    where pubname = 'supabase_realtime'
      and schemaname = 'public'
      and tablename = 'ics_question_stats'
  ) then
    alter publication supabase_realtime add table public.ics_question_stats;
  end if;
end;
$$;

comment on table public.ics_question_stats is 'Public aggregate statistics for the ICS quiz.';
comment on table public.ics_answer_receipts is 'Private per-browser receipts used to avoid duplicate counting.';
