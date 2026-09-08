-- 0005_join_applications.sql
-- Volunteer join applications, kept separate from the campus lead pair form
-- in applications. docs/RBAC.md section 4, docs/JOURNEYS.md P3 to P5.
--
-- Write model: a visitor self-registers for an account (RBAC.md section 12)
-- and the apply action then creates the people row and the join application
-- together (RBAC.md section 4). apply_to_join is the creation path, so a
-- draft exists before anyone is approved.

create type join_application_status as enum ('draft', 'submitted', 'approved', 'rejected');

create table join_applications (
  id            uuid primary key default gen_random_uuid(),
  person_id     uuid not null references people(id),
  department_id uuid references departments(id),
  status        join_application_status not null default 'draft',
  submitted_at  timestamptz,
  created_at    timestamptz not null default now(),
  constraint join_application_submitted_needs_timestamp
    check (status = 'draft' or submitted_at is not null)
);

-- One live join application per person. A rejected applicant may apply again.
create unique index join_applications_one_live_per_person
  on join_applications (person_id)
  where status <> 'rejected';

alter table join_applications enable row level security;

revoke all on join_applications from anon;
grant select, insert, update on join_applications to authenticated;
grant usage on type join_application_status to authenticated;

-- The apply action. It runs as the caller's auth account and creates the
-- person (pending, community) and the draft in one transaction. A returning
-- applicant reuses the existing person row, so their history is preserved.
create or replace function apply_to_join(
  p_full_name text,
  p_email text,
  p_department_id uuid default null
)
returns uuid
language plpgsql
security definer
set search_path = public
as $$
declare
  v_person_id uuid;
  v_join_id uuid;
begin
  if auth.uid() is null then
    raise exception 'Sign in before applying.';
  end if;

  if nullif(p_full_name, '') is null or nullif(p_email, '') is null then
    raise exception 'Full name and email are required to apply.';
  end if;

  select id into v_person_id
  from people
  where auth_user_id = auth.uid();

  if v_person_id is null then
    insert into people (auth_user_id, full_name, email, status, kind)
    values (auth.uid(), p_full_name, p_email, 'pending', 'community')
    returning id into v_person_id;
  end if;

  insert into join_applications (person_id, department_id)
  values (v_person_id, p_department_id)
  returning id into v_join_id;

  return v_join_id;
end;
$$;

revoke all on function apply_to_join(text, text, uuid) from public, anon;
grant execute on function apply_to_join(text, text, uuid) to authenticated;

-- An applicant reads their own applications only. people_manager reads and
-- decides everything (RBAC.md sections 4 and 5).
create policy join_applications_select on join_applications
  for select
  using (
    is_active()
    and (
      person_id = current_person_id()
      or has_permission('join_apps', 'read')
    )
  );

create policy join_applications_insert on join_applications
  for insert
  with check (
    is_active()
    and person_id = current_person_id()
  );

create policy join_applications_update on join_applications
  for update
  using (
    is_active()
    and (
      (person_id = current_person_id() and status = 'draft')
      or has_permission('join_apps', 'update')
    )
  )
  with check (
    is_active()
    and (
      (person_id = current_person_id() and status in ('draft', 'submitted'))
      or has_permission('join_apps', 'update')
    )
  );
