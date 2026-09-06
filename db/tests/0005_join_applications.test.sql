-- 0005_join_applications.test.sql
-- Join application RLS. Never run as postgres; superuser bypasses RLS.

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
  if to_regclass('public.join_applications') is null then
    raise exception 'join_applications is missing. Apply 0005_join_applications.sql';
  end if;
  if not exists (
    select 1 from information_schema.columns
    where table_name = 'people' and column_name = 'kind'
  ) then
    raise exception 'people.kind is missing. Apply 0004_person_kind.sql before 0005.';
  end if;
end;
$$;

-- Fatima (seeded applicant, pending) has one submitted application up front.
insert into join_applications (id, person_id, department_id, status, submitted_at)
values (
  'bbbbbbbb-0000-0000-0000-000000000001',
  '11111111-1111-1111-1111-100000000011',
  '55555555-5555-5555-5555-500000000001',
  'submitted',
  now()
);

\echo '--- TEST 1: a self-registered visitor applies; the system creates person and draft'
select pg_temp.as_person('aaaaaaaa-0000-0000-0000-000000000001');
set role authenticated;

do $$
declare
  v_join uuid;
  v_person uuid;
begin
  select apply_to_join('Test Applicant', 'applicant@example.org',
    '55555555-5555-5555-5555-500000000001') into v_join;

  select id into v_person
  from people
  where auth_user_id = 'aaaaaaaa-0000-0000-0000-000000000001';

  if v_person is null then
    raise exception 'apply_to_join did not create a person row';
  end if;

  if not exists (
    select 1 from people
    where id = v_person
      and status = 'pending'
      and kind = 'community'
  ) then
    raise exception 'apply_to_join created the person with the wrong status or kind';
  end if;

  if not exists (
    select 1 from join_applications
    where id = v_join
      and person_id = v_person
      and status = 'draft'
  ) then
    raise exception 'apply_to_join did not create a draft for the new person';
  end if;
end;
$$;

reset role;

\echo '--- TEST 2: the new applicant reads their own draft'
select pg_temp.as_person('aaaaaaaa-0000-0000-0000-000000000001');
set role authenticated;

do $$
declare
  n int;
begin
  select count(*) into n
  from join_applications
  where person_id = (
    select id from people where auth_user_id = 'aaaaaaaa-0000-0000-0000-000000000001'
  );
  if n <> 1 then
    raise exception 'Applicant could not read their own join application';
  end if;
end;
$$;

reset role;

\echo '--- TEST 3: the applicant submits their draft'
select pg_temp.as_person('aaaaaaaa-0000-0000-0000-000000000001');
set role authenticated;

do $$
declare
  n int;
begin
  update join_applications
  set status = 'submitted', submitted_at = now()
  where person_id = (
    select id from people where auth_user_id = 'aaaaaaaa-0000-0000-0000-000000000001'
  )
  and status = 'draft';

  select count(*) into n
  from join_applications
  where person_id = (
    select id from people where auth_user_id = 'aaaaaaaa-0000-0000-0000-000000000001'
  )
  and status = 'submitted';
  if n <> 1 then
    raise exception 'Applicant could not submit their own draft';
  end if;
end;
$$;

reset role;

\echo '--- TEST 4: the applicant cannot write after submit'
select pg_temp.as_person('aaaaaaaa-0000-0000-0000-000000000001');
set role authenticated;

do $$
declare
  s join_application_status;
begin
  update join_applications
  set status = 'approved'
  where person_id = (
    select id from people where auth_user_id = 'aaaaaaaa-0000-0000-0000-000000000001'
  );

  select status into s
  from join_applications
  where person_id = (
    select id from people where auth_user_id = 'aaaaaaaa-0000-0000-0000-000000000001'
  );
  if s <> 'submitted' then
    raise exception 'Applicant changed a submitted join application';
  end if;
end;
$$;

reset role;

\echo '--- TEST 5: a member cannot read someone else''s application'
select pg_temp.as_person('11111111-1111-1111-1111-100000000006');
set role authenticated;

do $$
declare
  n int;
begin
  select count(*) into n
  from join_applications
  where person_id = (
    select id from people where auth_user_id = 'aaaaaaaa-0000-0000-0000-000000000001'
  );
  if n <> 0 then
    raise exception 'Member read another applicant''s join application';
  end if;
end;
$$;

reset role;

\echo '--- TEST 6: the founder reads and approves'
select pg_temp.as_person('11111111-1111-1111-1111-100000000001');
set role authenticated;

do $$
declare
  n int;
begin
  select count(*) into n
  from join_applications
  where person_id in (
    select id from people where auth_user_id in (
      'aaaaaaaa-0000-0000-0000-000000000001',
      '11111111-1111-1111-1111-100000000011'
    )
  );
  if n <> 2 then
    raise exception 'Founder could not read join applications';
  end if;

  update join_applications
  set status = 'approved'
  where person_id = (
    select id from people where auth_user_id = 'aaaaaaaa-0000-0000-0000-000000000001'
  );

  select count(*) into n
  from join_applications
  where person_id = (
    select id from people where auth_user_id = 'aaaaaaaa-0000-0000-0000-000000000001'
  )
  and status = 'approved';
  if n <> 1 then
    raise exception 'Founder could not approve a join application';
  end if;
end;
$$;

reset role;

\echo '--- TEST 7: anon cannot run the apply action'
do $$
begin
  if has_function_privilege(
    'anon',
    'apply_to_join(text, text, uuid)'::regprocedure,
    'execute'
  ) then
    raise exception 'anon can execute apply_to_join';
  end if;
end;
$$;

\echo '--- 0005 join application tests finished'
