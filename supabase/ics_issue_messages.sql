-- Run AFTER ics_issue_reports.sql in the Supabase SQL Editor.
-- Idempotent additive upgrade; preserves reports and their counts.
begin;

alter table public.ics_question_issue_receipts
  add column if not exists message text not null default '';
alter table public.ics_question_issue_receipts
  add column if not exists message_id uuid not null default gen_random_uuid();
alter table public.ics_question_issue_receipts
  add column if not exists message_updated_at timestamptz;
create unique index if not exists ics_issue_message_id
  on public.ics_question_issue_receipts (message_id);

do $$
begin
  if not exists (
    select 1 from pg_catalog.pg_constraint
    where conrelid = 'public.ics_question_issue_receipts'::regclass
      and conname = 'ics_issue_message_length'
  ) then
    alter table public.ics_question_issue_receipts
      add constraint ics_issue_message_length check (char_length(message) <= 1000);
  end if;
end;
$$;

-- The old RPC remains available to old clients and still deduplicates by
-- (question_id, visitor_id). Raw receipt rows are never publicly readable.
create or replace function public.report_ics_question_issue_with_message(
  p_question_id text,
  p_visitor_id uuid,
  p_message text
)
returns setof public.ics_question_issue_reports
language plpgsql
security definer
set search_path = ''
as $$
declare
  v_message text := btrim(coalesce(p_message, ''));
begin
  if char_length(v_message) > 1000 then
    raise exception 'message must be at most 1000 characters';
  end if;

  -- Reuse ID validation and duplicate-count protection. Any failure in this
  -- function rolls back both the receipt and the aggregate update.
  perform 1 from private.report_ics_question_issue_internal(p_question_id, p_visitor_id);

  if v_message <> '' then
    update public.ics_question_issue_receipts
      set message = v_message, message_updated_at = now()
      where question_id = p_question_id and visitor_id = p_visitor_id;
    update public.ics_question_issue_reports
      set last_reported_at = now()
      where question_id = p_question_id;
  end if;

  return query select reports.* from public.ics_question_issue_reports as reports
    where reports.question_id = p_question_id;
end;
$$;

revoke all on table public.ics_question_issue_receipts from anon, authenticated;
grant select on table public.ics_question_issue_receipts to service_role;
-- An intentionally owner-rights, read-only projection: only issue text, a
-- random message ID and timestamp are public. Never expose visitor_id.
-- Do not change this to security_invoker: raw receipts are private by design.
create or replace view public.ics_question_issue_messages
  with (security_barrier = true) as
  select receipts.message_id as id, receipts.question_id, receipts.message,
    coalesce(receipts.message_updated_at, receipts.created_at) as reported_at
  from public.ics_question_issue_receipts as receipts
  where receipts.message <> '' and exists (
    select 1 from public.ics_question_issue_reports as reports
    where reports.question_id = receipts.question_id
  );
revoke all on public.ics_question_issue_messages from public, anon, authenticated;
grant select on public.ics_question_issue_messages to anon, authenticated, service_role;
revoke execute on function public.report_ics_question_issue_with_message(text, uuid, text) from public;
revoke execute on function public.report_ics_question_issue_with_message(text, uuid, text) from anon, authenticated;
grant execute on function public.report_ics_question_issue_with_message(text, uuid, text) to anon, authenticated;

comment on column public.ics_question_issue_receipts.message is
  'Optional public issue explanation, at most 1000 characters. Empty retries do not erase a prior explanation.';

commit;

-- Public clients can SELECT the view, never raw visitor receipts or write it.
-- select * from public.ics_question_issue_messages order by reported_at desc;
-- Existing resolve_ics_question_issue deletes these receipts/messages too.
