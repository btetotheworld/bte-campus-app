-- 0002_rbac.sql
-- Access model. Authoritative source: docs/RBAC.md sections 9 to 11.
--
-- Agents: do not edit 0001_init.sql. This file adds platform_roles,
-- role_permissions, audit_log, and the helpers every later policy calls.
-- It does not enable RLS. That is 0003_rls.sql, in the same pipeline,
-- never later by an hour.

create type platform_role as enum (
  'founder',
  'people_manager',
  'program_coordinator',
  'showcase_owner',
  'reviewer',
  'auditor'
);

create table platform_roles (
  id         uuid primary key default gen_random_uuid(),
  person_id  uuid not null references people(id) on delete cascade,
  role       platform_role not null,
  granted_by uuid not null references people(id),
  granted_at timestamptz not null default now(),
  unique (person_id, role),
  constraint no_self_grant check (
    granted_by <> person_id
    or current_user in ('postgres', 'supabase_admin')
  )
);

create table role_permissions (
  role      text not null,
  module    text not null,
  operation text not null,
  scope     text not null,
  primary key (role, module, operation, scope),
  constraint role_permissions_scope check (
    scope in ('global', 'own_department', 'own_chapter', 'self')
  )
);

create table audit_log (
  id          uuid primary key default gen_random_uuid(),
  occurred_at timestamptz not null default now(),
  actor_id    uuid references people(id),
  action      text not null,
  entity      text not null,
  entity_id   uuid,
  metadata    jsonb not null default '{}'::jsonb
);

-- ============================================================
-- Helpers. security definer so policies can read across tables.
-- Every policy in 0003 starts with is_active().
-- ============================================================

create or replace function current_person_id()
returns uuid
language sql
stable
security definer
set search_path = public
as $$
  select id
  from people
  where auth_user_id = auth.uid()
  limit 1
$$;

create or replace function is_active()
returns boolean
language sql
stable
security definer
set search_path = public
as $$
  select exists (
    select 1
    from people
    where id = current_person_id()
      and status <> 'inactive'
  )
$$;

create or replace function platform_role_rank(r platform_role)
returns int
language sql
immutable
as $$
  select case r
    when 'founder' then 100
    when 'people_manager' then 60
    when 'program_coordinator' then 60
    when 'showcase_owner' then 40
    when 'auditor' then 30
    when 'reviewer' then 20
  end
$$;

create or replace function highest_platform_rank(pid uuid)
returns int
language sql
stable
security definer
set search_path = public
as $$
  select coalesce(max(platform_role_rank(role)), 0)
  from platform_roles
  where person_id = pid
$$;

create or replace function has_platform_role(r platform_role)
returns boolean
language sql
stable
security definer
set search_path = public
as $$
  select exists (
    select 1
    from platform_roles
    where person_id = current_person_id()
      and role = r
  )
$$;

create or replace function has_permission(p_module text, p_operation text)
returns boolean
language plpgsql
stable
security definer
set search_path = public
as $$
begin
  if not is_active() then
    return false;
  end if;

  if has_platform_role('founder') then
    return true;
  end if;

  return exists (
    select 1
    from platform_roles pr
    join role_permissions rp
      on rp.role = pr.role::text
    where pr.person_id = current_person_id()
      and rp.module = p_module
      and rp.operation = p_operation
      and rp.scope = 'global'
  );
end;
$$;

create or replace function has_scoped(p_module text, p_operation text, p_dept_id uuid)
returns boolean
language plpgsql
stable
security definer
set search_path = public
as $$
begin
  if has_permission(p_module, p_operation) then
    return true;
  end if;

  if not is_active() then
    return false;
  end if;

  return exists (
    select 1
    from memberships m
    join role_permissions rp
      on rp.role = m.role::text
    where m.person_id = current_person_id()
      and m.ended_at is null
      and m.department_id = p_dept_id
      and rp.module = p_module
      and rp.operation = p_operation
      and rp.scope in ('own_department', 'own_chapter')
  );
end;
$$;

create or replace function is_member_of(p_chapter_id uuid)
returns boolean
language sql
stable
security definer
set search_path = public
as $$
  select exists (
    select 1
    from campus_chapters c
    where c.id = p_chapter_id
      and (
        exists (
          select 1
          from memberships m
          where m.person_id = current_person_id()
            and m.ended_at is null
            and m.department_id = c.department_id
        )
        or exists (
          select 1
          from chapter_members cm
          where cm.chapter_id = c.id
            and cm.person_id = current_person_id()
        )
      )
  )
$$;

create or replace function can_assign_chapter_lead()
returns boolean
language sql
stable
security definer
set search_path = public
as $$
  select is_active()
    and (
      has_platform_role('founder')
      or has_platform_role('program_coordinator')
    )
$$;

create or replace function chapter_department_id(p_chapter_id uuid)
returns uuid
language sql
stable
security definer
set search_path = public
as $$
  select department_id
  from campus_chapters
  where id = p_chapter_id
$$;

-- ============================================================
-- Escalation guards. docs/RBAC.md section 10.
-- Superuser and the migrator skip these so seed can load.
-- Authenticated writes do not.
-- ============================================================

create or replace function is_bootstrap_role()
returns boolean
language sql
stable
as $$
  select current_user in ('postgres', 'supabase_admin')
$$;

create or replace function enforce_platform_role_grant()
returns trigger
language plpgsql
set search_path = public
as $$
declare
  actor uuid;
  actor_rank int;
  target_rank int;
begin
  if is_bootstrap_role() then
    return new;
  end if;

  actor := current_person_id();
  if actor is null or not is_active() then
    raise exception 'Only an active signed-in person can grant a platform role';
  end if;

  if new.granted_by = new.person_id then
    raise exception 'Nobody grants themselves a platform role';
  end if;

  if new.granted_by <> actor then
    raise exception 'granted_by must be the signed-in person';
  end if;

  actor_rank := highest_platform_rank(actor);
  target_rank := platform_role_rank(new.role);
  if actor_rank = 0 or target_rank >= actor_rank then
    raise exception 'Nobody grants a role equal to or above their own';
  end if;

  return new;
end;
$$;

create trigger platform_roles_grant_guard
  before insert on platform_roles
  for each row
  execute function enforce_platform_role_grant();

create or replace function enforce_last_founder()
returns trigger
language plpgsql
set search_path = public
as $$
declare
  remaining int;
begin
  if is_bootstrap_role() then
    return old;
  end if;

  if old.role = 'founder' then
    select count(*) into remaining
    from platform_roles
    where role = 'founder'
      and person_id <> old.person_id;
    if remaining < 1 then
      raise exception 'Removing the last founder is blocked';
    end if;
  end if;

  return old;
end;
$$;

create trigger platform_roles_last_founder
  before delete on platform_roles
  for each row
  execute function enforce_last_founder();

create or replace function enforce_lead_role_grant()
returns trigger
language plpgsql
set search_path = public
as $$
begin
  if is_bootstrap_role() then
    return new;
  end if;

  if tg_op = 'INSERT'
     or new.lead_person_id is distinct from old.lead_person_id
     or new.assistant_person_id is distinct from old.assistant_person_id then
    if not can_assign_chapter_lead() then
      raise exception 'A campus lead cannot appoint a campus lead. The coordinator assigns chapter leads';
    end if;
  end if;

  return new;
end;
$$;

create trigger campus_chapters_lead_grant
  before insert or update on campus_chapters
  for each row
  execute function enforce_lead_role_grant();

-- ============================================================
-- Audit. Append-only. docs/RBAC.md section 11.
-- ============================================================

create or replace function reject_audit_mutation()
returns trigger
language plpgsql
as $$
begin
  raise exception 'audit_log is append-only';
end;
$$;

create trigger audit_log_no_update
  before update on audit_log
  for each row
  execute function reject_audit_mutation();

create trigger audit_log_no_delete
  before delete on audit_log
  for each row
  execute function reject_audit_mutation();

create or replace function audit_platform_role_change()
returns trigger
language plpgsql
security definer
set search_path = public
as $$
begin
  if tg_op = 'INSERT' then
    insert into audit_log (actor_id, action, entity, entity_id, metadata)
    values (
      new.granted_by,
      'platform_role_grant',
      'platform_roles',
      new.id,
      jsonb_build_object('person_id', new.person_id, 'role', new.role)
    );
    return new;
  end if;

  insert into audit_log (actor_id, action, entity, entity_id, metadata)
  values (
    current_person_id(),
    'platform_role_revoke',
    'platform_roles',
    old.id,
    jsonb_build_object('person_id', old.person_id, 'role', old.role)
  );
  return old;
end;
$$;

create trigger platform_roles_audit
  after insert or delete on platform_roles
  for each row
  execute function audit_platform_role_change();

-- ============================================================
-- Permission catalogue. Data, not code. docs/RBAC.md section 6.
-- ============================================================

insert into role_permissions (role, module, operation, scope) values
  ('founder', 'audit', 'read', 'global'),
  ('founder', 'settings', 'update', 'global'),
  ('people_manager', 'departments', 'read', 'global'),
  ('people_manager', 'departments', 'create', 'global'),
  ('people_manager', 'departments', 'update', 'global'),
  ('people_manager', 'people', 'read', 'global'),
  ('people_manager', 'people', 'update', 'global'),
  ('people_manager', 'join_apps', 'read', 'global'),
  ('people_manager', 'join_apps', 'update', 'global'),
  ('program_coordinator', 'cohorts', 'read', 'global'),
  ('program_coordinator', 'campus_applications', 'read', 'global'),
  ('program_coordinator', 'campus_applications', 'update', 'global'),
  ('program_coordinator', 'interviews', 'read', 'global'),
  ('program_coordinator', 'fellowships', 'read', 'global'),
  ('program_coordinator', 'chapters', 'read', 'global'),
  ('program_coordinator', 'chapters', 'update', 'global'),
  ('program_coordinator', 'approvals', 'confirm_gate', 'global'),
  ('program_coordinator', 'meetings', 'read', 'global'),
  ('program_coordinator', 'reports', 'read', 'global'),
  ('program_coordinator', 'chapter_members', 'read', 'global'),
  ('program_coordinator', 'build_logs', 'read', 'global'),
  ('program_coordinator', 'escalations', 'read', 'global'),
  ('program_coordinator', 'succession', 'read', 'global'),
  ('program_coordinator', 'people', 'read', 'global'),
  ('showcase_owner', 'submissions', 'read', 'global'),
  ('showcase_owner', 'reviews', 'read', 'global'),
  ('showcase_owner', 'selection', 'update', 'global'),
  ('reviewer', 'submissions', 'read', 'self'),
  ('reviewer', 'reviews', 'update', 'self'),
  ('auditor', 'audit', 'read', 'global'),
  ('campus_lead', 'meetings', 'read', 'own_chapter'),
  ('campus_lead', 'meetings', 'create', 'own_chapter'),
  ('campus_lead', 'meetings', 'update', 'own_chapter'),
  ('campus_lead', 'reports', 'read', 'own_chapter'),
  ('campus_lead', 'reports', 'create', 'own_chapter'),
  ('campus_lead', 'chapter_members', 'read', 'own_chapter'),
  ('campus_lead', 'chapter_members', 'update', 'own_chapter'),
  ('campus_lead', 'build_logs', 'read', 'own_chapter'),
  ('campus_lead', 'escalations', 'create', 'own_chapter'),
  ('assistant_lead', 'meetings', 'read', 'own_chapter'),
  ('assistant_lead', 'meetings', 'create', 'own_chapter'),
  ('assistant_lead', 'meetings', 'update', 'own_chapter'),
  ('assistant_lead', 'reports', 'read', 'own_chapter'),
  ('assistant_lead', 'reports', 'create', 'own_chapter'),
  ('assistant_lead', 'chapter_members', 'read', 'own_chapter'),
  ('assistant_lead', 'chapter_members', 'update', 'own_chapter'),
  ('assistant_lead', 'build_logs', 'read', 'own_chapter'),
  ('assistant_lead', 'escalations', 'create', 'own_chapter'),
  ('practitioner', 'meetings', 'read', 'own_chapter'),
  ('practitioner', 'reports', 'read', 'own_chapter'),
  ('member', 'meetings', 'read', 'own_chapter'),
  ('member', 'build_logs', 'create', 'self'),
  ('member', 'submissions', 'create', 'self'),
  ('member', 'submissions', 'read', 'self'),
  ('coordinator', 'cohorts', 'read', 'global'),
  ('coordinator', 'campus_applications', 'read', 'global'),
  ('coordinator', 'campus_applications', 'update', 'global'),
  ('coordinator', 'interviews', 'read', 'global'),
  ('coordinator', 'fellowships', 'read', 'global'),
  ('coordinator', 'chapters', 'read', 'global'),
  ('coordinator', 'chapters', 'update', 'global'),
  ('coordinator', 'approvals', 'confirm_gate', 'global'),
  ('coordinator', 'meetings', 'read', 'global'),
  ('coordinator', 'reports', 'read', 'global'),
  ('coordinator', 'chapter_members', 'read', 'global'),
  ('coordinator', 'build_logs', 'read', 'global'),
  ('coordinator', 'escalations', 'read', 'global'),
  ('coordinator', 'succession', 'read', 'global'),
  ('coordinator', 'people', 'read', 'global'),
  ('auditor', 'departments', 'read', 'global'),
  ('auditor', 'people', 'read', 'global'),
  ('auditor', 'cohorts', 'read', 'global'),
  ('auditor', 'campus_applications', 'read', 'global'),
  ('auditor', 'interviews', 'read', 'global'),
  ('auditor', 'fellowships', 'read', 'global'),
  ('auditor', 'chapters', 'read', 'global'),
  ('auditor', 'meetings', 'read', 'global'),
  ('auditor', 'reports', 'read', 'global'),
  ('auditor', 'chapter_members', 'read', 'global'),
  ('auditor', 'build_logs', 'read', 'global'),
  ('auditor', 'escalations', 'read', 'global'),
  ('auditor', 'succession', 'read', 'global'),
  ('auditor', 'submissions', 'read', 'global'),
  ('auditor', 'reviews', 'read', 'global');

grant execute on function current_person_id() to authenticated;
grant execute on function is_active() to authenticated;
grant execute on function has_permission(text, text) to authenticated;
grant execute on function has_scoped(text, text, uuid) to authenticated;
grant execute on function is_member_of(uuid) to authenticated;
grant execute on function can_assign_chapter_lead() to authenticated;
grant execute on function chapter_department_id(uuid) to authenticated;
grant execute on function has_platform_role(platform_role) to authenticated;
