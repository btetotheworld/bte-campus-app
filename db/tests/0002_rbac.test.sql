-- 0002_rbac.test.sql
-- Escalation guards from docs/RBAC.md section 10.
-- Run after seed. Superuser skips the grant triggers, so the cases that
-- must fail run as authenticated with a JWT sub.

\set ON_ERROR_STOP 1

create or replace function pg_temp.as_person(uid uuid)
returns void
language plpgsql
as $$
begin
  perform set_config('request.jwt.claim.sub', uid::text, false);
  perform set_config(
    'request.jwt.claims',
    json_build_object('sub', uid::text, 'role', 'authenticated')::text,
    false
  );
end;
$$;

do $$
begin
  if to_regclass('public.platform_roles') is null then
    raise exception 'platform_roles is missing. Apply 0002_rbac.sql';
  end if;
end;
$$;

\echo '--- TEST 1: Ada holds founder, Emeka holds program_coordinator'
do $$
begin
  if not exists (
    select 1 from platform_roles
    where person_id = '11111111-1111-1111-1111-100000000001'
      and role = 'founder'
  ) then
    raise exception 'Ada is not seeded as founder';
  end if;
  if not exists (
    select 1 from platform_roles
    where person_id = '11111111-1111-1111-1111-100000000002'
      and role = 'program_coordinator'
  ) then
    raise exception 'Emeka is not seeded as program_coordinator';
  end if;
end;
$$;

\echo '--- TEST 2: founder grant is in the audit log'
do $$
begin
  if not exists (
    select 1 from audit_log
    where action = 'platform_role_grant'
      and metadata ->> 'role' = 'founder'
  ) then
    raise exception 'Founder grant was not audited';
  end if;
end;
$$;

\echo '--- TEST 3: coordinator cannot grant founder'
select pg_temp.as_person('11111111-1111-1111-1111-100000000002');
set role authenticated;
\set ON_ERROR_STOP 0
insert into platform_roles (person_id, role, granted_by)
values (
  '11111111-1111-1111-1111-100000000003',
  'founder',
  '11111111-1111-1111-1111-100000000002'
);
\set ON_ERROR_STOP 1
reset role;

do $$
begin
  if exists (
    select 1 from platform_roles
    where person_id = '11111111-1111-1111-1111-100000000003'
      and role = 'founder'
  ) then
    raise exception 'Coordinator granted founder';
  end if;
end;
$$;

\echo '--- TEST 4: nobody grants themselves a platform role'
select pg_temp.as_person('11111111-1111-1111-1111-100000000001');
set role authenticated;
\set ON_ERROR_STOP 0
insert into platform_roles (person_id, role, granted_by)
values (
  '11111111-1111-1111-1111-100000000001',
  'auditor',
  '11111111-1111-1111-1111-100000000001'
);
\set ON_ERROR_STOP 1
reset role;

do $$
begin
  if exists (
    select 1 from platform_roles
    where person_id = '11111111-1111-1111-1111-100000000001'
      and role = 'auditor'
  ) then
    raise exception 'Self-grant succeeded';
  end if;
end;
$$;

\echo '--- TEST 5: removing the last founder is blocked'
select pg_temp.as_person('11111111-1111-1111-1111-100000000001');
set role authenticated;
\set ON_ERROR_STOP 0
delete from platform_roles
where person_id = '11111111-1111-1111-1111-100000000001'
  and role = 'founder';
\set ON_ERROR_STOP 1
reset role;

do $$
begin
  if not exists (
    select 1 from platform_roles
    where person_id = '11111111-1111-1111-1111-100000000001'
      and role = 'founder'
  ) then
    raise exception 'Last founder was removed';
  end if;
end;
$$;

\echo '--- TEST 6: a campus lead cannot appoint a campus lead'
select pg_temp.as_person('11111111-1111-1111-1111-100000000003');
set role authenticated;
\set ON_ERROR_STOP 0
update campus_chapters
set lead_person_id = '11111111-1111-1111-1111-100000000005'
where id = '77777777-7777-7777-7777-700000000001';
\set ON_ERROR_STOP 1
reset role;

do $$
begin
  if exists (
    select 1 from campus_chapters
    where id = '77777777-7777-7777-7777-700000000001'
      and lead_person_id = '11111111-1111-1111-1111-100000000005'
  ) then
    raise exception 'Campus lead appointed a campus lead';
  end if;
end;
$$;

\echo '--- TEST 7: inactive person is not is_active'
update people
set status = 'inactive'
where id = '11111111-1111-1111-1111-100000000007';

select pg_temp.as_person('11111111-1111-1111-1111-100000000007');
set role authenticated;

do $$
begin
  if is_active() then
    raise exception 'inactive person reported as active';
  end if;
end;
$$;

reset role;

update people
set status = 'verified'
where id = '11111111-1111-1111-1111-100000000007';

\echo '--- 0002 rbac tests finished'
