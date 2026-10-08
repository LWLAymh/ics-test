-- Public question issue reporting for the static ICS quiz site.
-- Run once in Supabase Dashboard -> SQL Editor.

create schema if not exists private;

create table if not exists public.ics_question_issue_reports (
  question_id text primary key,
  report_count bigint not null default 1 check (report_count >= 1),
  first_reported_at timestamptz not null default now(),
  last_reported_at timestamptz not null default now()
);

create table if not exists public.ics_question_issue_receipts (
  question_id text not null,
  visitor_id uuid not null,
  created_at timestamptz not null default now(),
  primary key (question_id, visitor_id)
);

alter table public.ics_question_issue_reports enable row level security;
alter table public.ics_question_issue_receipts enable row level security;

revoke all on table public.ics_question_issue_reports from anon, authenticated;
revoke all on table public.ics_question_issue_receipts from anon, authenticated;
grant select on table public.ics_question_issue_reports to anon, authenticated;

drop policy if exists "Public can read ICS question issue reports" on public.ics_question_issue_reports;
create policy "Public can read ICS question issue reports"
  on public.ics_question_issue_reports
  for select
  to anon, authenticated
  using (true);

create or replace function private.report_ics_question_issue_internal(
  p_question_id text,
  p_visitor_id uuid
)
returns setof public.ics_question_issue_reports
language plpgsql
security definer
set search_path = ''
as $$
declare
  v_inserted integer := 0;
begin
  if p_question_id is null or p_question_id !~ '^q-[a-f0-9]{8,64}$' then
    raise exception 'invalid question id';
  end if;
  if p_visitor_id is null then
    raise exception 'visitor id is required';
  end if;

  insert into public.ics_question_issue_receipts (question_id, visitor_id)
  values (p_question_id, p_visitor_id)
  on conflict (question_id, visitor_id) do nothing;
  get diagnostics v_inserted = row_count;

  if v_inserted > 0 then
    insert into public.ics_question_issue_reports (
      question_id, report_count, first_reported_at, last_reported_at
    ) values (
      p_question_id, 1, now(), now()
    )
    on conflict (question_id) do update set
      report_count = public.ics_question_issue_reports.report_count + 1,
      last_reported_at = now();
  end if;

  return query
    select reports.*
    from public.ics_question_issue_reports as reports
    where reports.question_id = p_question_id;
end;
$$;

revoke execute on function private.report_ics_question_issue_internal(text, uuid) from public;
revoke execute on function private.report_ics_question_issue_internal(text, uuid) from anon, authenticated;

create or replace function public.report_ics_question_issue(
  p_question_id text,
  p_visitor_id uuid
)
returns setof public.ics_question_issue_reports
language sql
security definer
set search_path = ''
as $$
  select *
  from private.report_ics_question_issue_internal(p_question_id, p_visitor_id);
$$;

revoke execute on function public.report_ics_question_issue(text, uuid) from public;
revoke execute on function public.report_ics_question_issue(text, uuid) from anon, authenticated;
grant execute on function public.report_ics_question_issue(text, uuid) to anon, authenticated;

create or replace function public.resolve_ics_question_issue(p_question_id text)
returns boolean
language plpgsql
security definer
set search_path = ''
as $$
declare
  v_deleted integer := 0;
begin
  if auth.role() <> 'service_role' then
    raise exception 'service_role required';
  end if;
  if p_question_id is null or p_question_id !~ '^q-[a-f0-9]{8,64}$' then
    raise exception 'invalid question id';
  end if;

  delete from public.ics_question_issue_receipts where question_id = p_question_id;
  delete from public.ics_question_issue_reports where question_id = p_question_id;
  get diagnostics v_deleted = row_count;
  return v_deleted > 0;
end;
$$;

revoke execute on function public.resolve_ics_question_issue(text) from public;
revoke execute on function public.resolve_ics_question_issue(text) from anon, authenticated;
grant execute on function public.resolve_ics_question_issue(text) to service_role;

do $$
begin
  if not exists (
    select 1
    from pg_catalog.pg_publication_tables
    where pubname = 'supabase_realtime'
      and schemaname = 'public'
      and tablename = 'ics_question_issue_reports'
  ) then
    alter publication supabase_realtime add table public.ics_question_issue_reports;
  end if;
end;
$$;

comment on table public.ics_question_issue_reports is 'Public aggregate list of ICS questions reported for review.';
comment on table public.ics_question_issue_receipts is 'Private per-browser receipts that prevent duplicate issue counts.';
comment on function public.resolve_ics_question_issue(text) is 'Service-role-only removal after a question is fixed; also clears receipts so it can be reported again.';

