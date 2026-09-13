-- 0006_auto_verify.sql
-- Journey P8 / job X6. Auto-verify pending team people after 90 days.
-- docs/RBAC.md sections 2 and 9. Visibility changes; permissions do not.
-- Minor exclusion waits on docs/RBAC.md section 13 (no date_of_birth column yet).

alter table people
  add column pending_since timestamptz;

comment on column people.pending_since is
  'When the 90-day pending clock started, usually at join approval.';

-- Approval starts the clock when someone becomes a pending team volunteer.
create or replace function set_pending_since_on_team_kind()
returns trigger
language plpgsql
as $$
begin
  if new.kind = 'team'
     and new.status = 'pending'
     and new.pending_since is null
     and (tg_op = 'INSERT' or old.kind is distinct from 'team') then
    new.pending_since := now();
  end if;
  return new;
end;
$$;

drop trigger if exists people_pending_since_on_team on people;
create trigger people_pending_since_on_team
  before insert or update on people
  for each row
  execute function set_pending_since_on_team_kind();

create or replace function auto_verify_pending_duration()
returns interval
language sql
immutable
as $$
  select interval '90 days';
$$;

-- Shared status write for P8 (job) and future P9 (admin override).
create or replace function verify_person(p_person_id uuid)
returns void
language plpgsql
security definer
set search_path = public
as $$
declare
  v_status person_status;
  v_kind person_kind;
begin
  select status, kind
  into v_status, v_kind
  from people
  where id = p_person_id
  for update;

  if not found then
    raise exception 'person not found';
  end if;

  if v_status = 'verified' then
    return;
  end if;

  if v_status <> 'pending' then
    raise exception 'only a pending person can be verified';
  end if;

  update people
  set status = 'verified',
      verified_at = now()
  where id = p_person_id;

  if v_kind = 'team' then
    insert into badges (person_id, badge)
    values (p_person_id, 'called')
    on conflict (person_id, badge) do nothing;
  end if;
end;
$$;

revoke all on function verify_person(uuid) from public;

create or replace function auto_verify_people()
returns jsonb
language plpgsql
security invoker
set search_path = public
as $$
declare
  v_person_id uuid;
  v_verified int := 0;
begin
  if current_user <> 'service_role'
     and coalesce(current_setting('request.jwt.claim.role', true), '') <>
       'service_role' then
    raise exception 'auto_verify_people requires the service role';
  end if;

  for v_person_id in
    select id
    from people
    where status = 'pending'
      and kind = 'team'
      and pending_since is not null
      and pending_since <= now() - auto_verify_pending_duration()
    for update
  loop
    perform verify_person(v_person_id);
    v_verified := v_verified + 1;
  end loop;

  return jsonb_build_object('verified_count', v_verified);
end;
$$;

revoke all on function auto_verify_people() from public;
grant execute on function auto_verify_people() to service_role;

create or replace function auto_verify_status()
returns jsonb
language plpgsql
stable
security definer
set search_path = public
as $$
begin
  if not (is_active() and has_permission('people', 'read')) then
    raise exception 'not authorized to read auto-verify status';
  end if;

  return jsonb_build_object(
    'ready_count', (
      select count(*)::int
      from people
      where status = 'pending'
        and kind = 'team'
        and pending_since is not null
        and pending_since <= now() - auto_verify_pending_duration()
    ),
    'waiting_count', (
      select count(*)::int
      from people
      where status = 'pending'
        and kind = 'team'
        and pending_since is not null
        and pending_since > now() - auto_verify_pending_duration()
    )
  );
end;
$$;

revoke all on function auto_verify_status() from public;
grant execute on function auto_verify_status() to authenticated;

create or replace function audit_person_status_change()
returns trigger
language plpgsql
security definer
set search_path = public
as $$
begin
  if old.status is distinct from new.status then
    insert into audit_log (actor_id, action, entity, entity_id, metadata)
    values (
      current_person_id(),
      'person_status_change',
      'people',
      new.id,
      jsonb_build_object('from_status', old.status, 'to_status', new.status)
    );
  end if;
  return new;
end;
$$;

drop trigger if exists people_status_audit on people;
create trigger people_status_audit
  after update on people
  for each row
  execute function audit_person_status_change();
