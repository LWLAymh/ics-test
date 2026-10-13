-- Run this complete script once in Supabase SQL Editor. Safe to rerun.
-- Published question IDs are checked by the Worker against the live site index.
begin;
create schema if not exists private;
-- A narrow publishing capability, NOT a Supabase administrator credential.
-- Only the separate website publishing Worker holds it; MCP does not.
create table if not exists private.ics_community_publish_key (
  singleton boolean primary key default true check (singleton),
  token text not null check (token ~ '^[a-f0-9]{64}$')
);
insert into private.ics_community_publish_key(singleton, token)
  values (true, replace(gen_random_uuid()::text || gen_random_uuid()::text, '-', '')) on conflict do nothing;
alter table private.ics_community_publish_key enable row level security;
revoke all on private.ics_community_publish_key from public, anon, authenticated;
create table if not exists public.ics_community_papers (
  id uuid primary key,
  title text not null check (char_length(title) between 1 and 60),
  author_name text not null check (char_length(author_name) between 1 and 40),
  description text not null default '' check (char_length(description) <= 500),
  question_ids text[] not null check (cardinality(question_ids) between 1 and 200),
  status text not null default 'published' check (status in ('published', 'hidden')),
  created_at timestamptz not null default now(),
  like_count bigint not null default 0 check (like_count >= 0),
  participant_count bigint not null default 0 check (participant_count >= 0)
);
create index if not exists ics_community_newest on public.ics_community_papers (created_at desc, id desc) where status = 'published';
create index if not exists ics_community_popular on public.ics_community_papers (like_count desc, created_at desc, id desc) where status = 'published';
create table if not exists private.ics_community_creators (
  paper_id uuid primary key references public.ics_community_papers(id),
  visitor_id uuid not null,
  created_at timestamptz not null default now()
);
create index if not exists ics_community_creator_quota on private.ics_community_creators (visitor_id, created_at);
create table if not exists private.ics_community_likes (
  paper_id uuid not null references public.ics_community_papers(id), visitor_id uuid not null,
  primary key (paper_id, visitor_id)
);
create table if not exists private.ics_community_participants (
  paper_id uuid not null references public.ics_community_papers(id), visitor_id uuid not null,
  primary key (paper_id, visitor_id)
);
create table if not exists private.ics_community_reports (
  id uuid primary key default gen_random_uuid(),
  paper_id uuid not null references public.ics_community_papers(id), visitor_id uuid not null,
  message text not null default '' check (char_length(message) <= 1000),
  created_at timestamptz not null default now(), unique (paper_id, visitor_id)
);
create index if not exists ics_community_report_time on private.ics_community_reports (created_at desc);
create table if not exists private.ics_community_rate (
  visitor_id uuid primary key, window_start timestamptz not null, requests integer not null
);
alter table public.ics_community_papers enable row level security;
alter table private.ics_community_creators enable row level security;
alter table private.ics_community_likes enable row level security;
alter table private.ics_community_participants enable row level security;
alter table private.ics_community_reports enable row level security;
alter table private.ics_community_rate enable row level security;
revoke all on public.ics_community_papers from public, anon, authenticated;
revoke all on private.ics_community_creators,
  private.ics_community_likes, private.ics_community_participants,
  private.ics_community_reports, private.ics_community_rate from public, anon, authenticated;
grant select on public.ics_community_papers to anon, authenticated;
drop policy if exists "Published community papers" on public.ics_community_papers;
create policy "Published community papers" on public.ics_community_papers for select to anon, authenticated using (status = 'published');

-- Deliberately omit all visitor IDs, including the creator's ID, from public data.
create or replace view public.ics_community_paper_reports as
  select r.id, r.paper_id, p.title as paper_title, r.message, r.created_at
  from private.ics_community_reports r join public.ics_community_papers p on p.id = r.paper_id
  where p.status = 'published';
revoke all on public.ics_community_paper_reports from public, anon, authenticated;
grant select on public.ics_community_paper_reports to anon, authenticated;

create or replace function private.ics_community_throttle(p_visitor_id uuid)
returns void language plpgsql security definer set search_path = '' as $$
declare v_allowed integer;
begin
  if p_visitor_id is null then raise exception 'visitor required'; end if;
  insert into private.ics_community_rate as r values (p_visitor_id, now(), 1)
  on conflict (visitor_id) do update set
    requests = case when r.window_start < now() - interval '1 minute' then 1 else r.requests + 1 end,
    window_start = case when r.window_start < now() - interval '1 minute' then now() else r.window_start end
  where r.window_start < now() - interval '1 minute' or r.requests < 60
  returning requests into v_allowed;
  if v_allowed is null then raise exception 'rate limit'; end if;
end; $$;
revoke all on function private.ics_community_throttle(uuid) from public, anon, authenticated;

create or replace function public.publish_ics_community_paper(
  p_id uuid, p_title text, p_author_name text, p_description text, p_question_ids text[], p_visitor_id uuid, p_publish_token text
)
returns uuid language plpgsql security definer set search_path = '' as $$
declare v_existing public.ics_community_papers; v_creator uuid;
begin
  if p_publish_token is null or p_publish_token !~ '^[a-f0-9]{64}$' or not exists
    (select 1 from private.ics_community_publish_key where token = p_publish_token) then raise exception 'publishing capability required'; end if;
  perform private.ics_community_throttle(p_visitor_id);
  if p_id is null or p_title is null or char_length(btrim(p_title)) not between 1 and 60 or
    p_author_name is null or char_length(btrim(p_author_name)) not between 1 and 40 or
    p_description is null or char_length(btrim(p_description)) > 500 then raise exception 'invalid metadata'; end if;
  if p_question_ids is null or cardinality(p_question_ids) not between 1 and 200 or array_ndims(p_question_ids) <> 1 or
    exists (select 1 from unnest(p_question_ids) q where q is null or q !~ '^q-[a-f0-9]{8,64}$') or
    (select count(distinct q) from unnest(p_question_ids) q) <> cardinality(p_question_ids) then raise exception 'invalid question list'; end if;
  -- Browser and paper locks serialize limits and idempotent retries.
  perform pg_catalog.pg_advisory_xact_lock(pg_catalog.hashtext('community-creator:' || p_visitor_id::text));
  perform pg_catalog.pg_advisory_xact_lock(pg_catalog.hashtext('community-paper:' || p_id::text));
  select * into v_existing from public.ics_community_papers where id = p_id;
  if found then
    select visitor_id into v_creator from private.ics_community_creators where paper_id = p_id;
    if v_creator is distinct from p_visitor_id or v_existing.title <> btrim(p_title) or
      v_existing.author_name <> btrim(p_author_name) or v_existing.description <> btrim(p_description) or
      v_existing.question_ids <> p_question_ids then raise exception 'paper id conflict'; end if;
    if v_existing.status <> 'published' then raise exception 'paper not available'; end if;
    return p_id;
  end if;
  if (select count(*) from private.ics_community_creators where visitor_id = p_visitor_id and created_at > now() - interval '24 hours') >= 5 then raise exception 'publish limit'; end if;
  insert into public.ics_community_papers(id, title, author_name, description, question_ids)
    values (p_id, btrim(p_title), btrim(p_author_name), btrim(p_description), p_question_ids);
  insert into private.ics_community_creators(paper_id, visitor_id) values (p_id, p_visitor_id);
  return p_id;
end; $$;

create or replace function public.list_ics_community_papers(p_sort text, p_offset integer, p_visitor_id uuid)
returns table(id uuid, title text, author_name text, description text, question_ids text[], created_at timestamptz,
  like_count bigint, participant_count bigint, liked boolean)
language plpgsql security definer set search_path = '' as $$
begin
  if p_sort is null or p_sort not in ('newest', 'popular') or p_offset is null or p_offset < 0 or p_offset > 100000 then raise exception 'invalid pagination'; end if;
  return query select p.id, p.title, p.author_name, p.description, p.question_ids, p.created_at, p.like_count, p.participant_count,
    exists(select 1 from private.ics_community_likes l where l.paper_id = p.id and l.visitor_id = p_visitor_id)
    from public.ics_community_papers p where p.status = 'published'
    order by case when p_sort = 'popular' then p.like_count end desc, p.created_at desc, p.id desc limit 12 offset p_offset;
end; $$;

create or replace function public.like_ics_community_paper(p_id uuid, p_visitor_id uuid, p_liked boolean)
returns void language plpgsql security definer set search_path = '' as $$
declare v_changed integer;
begin
  perform private.ics_community_throttle(p_visitor_id);
  if p_liked is null then raise exception 'liked required'; end if;
  perform 1 from public.ics_community_papers where id = p_id and status = 'published' for update;
  if not found then raise exception 'paper not available'; end if;
  if p_liked then
    insert into private.ics_community_likes values (p_id, p_visitor_id) on conflict do nothing;
    get diagnostics v_changed = row_count;
    update public.ics_community_papers set like_count = like_count + v_changed where id = p_id;
  else
    delete from private.ics_community_likes where paper_id = p_id and visitor_id = p_visitor_id;
    get diagnostics v_changed = row_count;
    update public.ics_community_papers set like_count = like_count - v_changed where id = p_id;
  end if;
end; $$;

create or replace function public.participate_ics_community_paper(p_id uuid, p_visitor_id uuid)
returns void language plpgsql security definer set search_path = '' as $$
declare v_changed integer;
begin
  perform private.ics_community_throttle(p_visitor_id);
  perform 1 from public.ics_community_papers where id = p_id and status = 'published' for update;
  if not found then raise exception 'paper not available'; end if;
  insert into private.ics_community_participants values (p_id, p_visitor_id) on conflict do nothing;
  get diagnostics v_changed = row_count;
  update public.ics_community_papers set participant_count = participant_count + v_changed where id = p_id;
end; $$;

create or replace function public.report_ics_community_paper(p_id uuid, p_visitor_id uuid, p_message text)
returns void language plpgsql security definer set search_path = '' as $$
begin
  perform private.ics_community_throttle(p_visitor_id);
  if p_message is null or char_length(p_message) > 1000 then raise exception 'invalid report'; end if;
  perform 1 from public.ics_community_papers where id = p_id and status = 'published' for update;
  if not found then raise exception 'paper not available'; end if;
  insert into private.ics_community_reports(paper_id, visitor_id, message) values (p_id, p_visitor_id, btrim(p_message))
    on conflict(paper_id, visitor_id) do update set message = excluded.message, created_at = now();
end; $$;

-- Admin-only hide/restore; data, receipts and reports are retained as backup.
create or replace function public.moderate_ics_community_paper(p_id uuid, p_hidden boolean)
returns boolean language plpgsql security definer set search_path = '' as $$
begin
  if auth.role() is distinct from 'service_role' then raise exception 'service_role required'; end if;
  if p_hidden is null then raise exception 'hidden required'; end if;
  update public.ics_community_papers set status = case when p_hidden then 'hidden' else 'published' end where id = p_id;
  return found;
end; $$;
create or replace function public.resolve_ics_community_paper_reports(p_id uuid)
returns void language plpgsql security definer set search_path = '' as $$
begin
  if auth.role() is distinct from 'service_role' then raise exception 'service_role required'; end if;
  delete from private.ics_community_reports where paper_id = p_id;
end; $$;

revoke all on function public.publish_ics_community_paper(uuid,text,text,text,text[],uuid,text),
  public.list_ics_community_papers(text,integer,uuid), public.like_ics_community_paper(uuid,uuid,boolean),
  public.participate_ics_community_paper(uuid,uuid), public.report_ics_community_paper(uuid,uuid,text),
  public.moderate_ics_community_paper(uuid,boolean), public.resolve_ics_community_paper_reports(uuid) from public, anon, authenticated;
grant execute on function public.publish_ics_community_paper(uuid,text,text,text,text[],uuid,text), public.list_ics_community_papers(text,integer,uuid), public.like_ics_community_paper(uuid,uuid,boolean),
  public.participate_ics_community_paper(uuid,uuid), public.report_ics_community_paper(uuid,uuid,text) to anon, authenticated;
grant execute on function public.moderate_ics_community_paper(uuid,boolean), public.resolve_ics_community_paper_reports(uuid) to service_role;
comment on table public.ics_community_papers is 'Directly published fixed question-ID lists; no copied question text or answers. Anonymous browser counts are best effort, not authenticated identities.';
commit;
-- Admin SQL Editor output only. Copy this into the SEPARATE publishing Worker's
-- COMMUNITY_PUBLISH_TOKEN Secret. Never paste it in chat, MCP or the browser.
select token as community_publish_token from private.ics_community_publish_key;
