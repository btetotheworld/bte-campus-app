-- 0003_rls.test.sql
-- Negative cases from docs/RBAC.md section 7.
-- Never run as postgres. Superuser bypasses RLS and proves nothing.

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
declare
  rls boolean;
begin
  select relrowsecurity into rls
  from pg_class
  where oid = 'public.meeting_reports'::regclass;
  if coalesce(rls, false) is not true then
    raise exception 'RLS is not enabled on meeting_reports. Apply 0003_rls.sql';
  end if;
end;
$$;

\echo '--- TEST 1: a lead cannot read another chapter report'
select pg_temp.as_person('11111111-1111-1111-1111-100000000003');
set role authenticated;

do $$
declare
  n int;
begin
  select count(*) into n
  from meeting_reports
  where meeting_id = '99999999-9999-9999-9999-900000000002';
  if n <> 0 then
    raise exception 'UNILAG lead read the OAU meeting report';
  end if;
end;
$$;

reset role;

\echo '--- TEST 2: that lead can read their own chapter report'
select pg_temp.as_person('11111111-1111-1111-1111-100000000003');
set role authenticated;

do $$
declare
  n int;
begin
  select count(*) into n
  from meeting_reports
  where meeting_id = '99999999-9999-9999-9999-900000000001';
  if n <> 1 then
    raise exception 'UNILAG lead could not read the UNILAG meeting report';
  end if;
end;
$$;

reset role;

\echo '--- TEST 3: an applicant cannot read their own scores'
select pg_temp.as_person('11111111-1111-1111-1111-100000000011');
set role authenticated;

do $$
declare
  n int;
begin
  select count(*) into n
  from application_scores
  where application_id = '66666666-6666-6666-6666-600000000003';
  if n <> 0 then
    raise exception 'Applicant read their own application scores';
  end if;

  select count(*) into n
  from interviews
  where application_id = '66666666-6666-6666-6666-600000000003';
  if n <> 0 then
    raise exception 'Applicant read their own interview scorecard';
  end if;

  select count(*) into n
  from fellowship_scorecards
  where application_id = '66666666-6666-6666-6666-600000000001';
  if n <> 0 then
    raise exception 'Applicant read a fellowship scorecard';
  end if;
end;
$$;

reset role;

\echo '--- TEST 4: coordinator can read application scores'
select pg_temp.as_person('11111111-1111-1111-1111-100000000002');
set role authenticated;

do $$
declare
  n int;
begin
  select count(*) into n
  from application_scores
  where application_id = '66666666-6666-6666-6666-600000000003';
  if n <> 1 then
    raise exception 'Coordinator could not read application scores';
  end if;
end;
$$;

reset role;

\echo '--- TEST 5: a member cannot see another member submission'
select pg_temp.as_person('11111111-1111-1111-1111-100000000006');
set role authenticated;

do $$
declare
  n int;
begin
  select count(*) into n
  from submissions
  where id = 'aaaaaaaa-1111-1111-1111-a00000000002';
  if n <> 0 then
    raise exception 'UNILAG member read the OAU member submission';
  end if;
end;
$$;

reset role;

\echo '--- TEST 6: a member can read their own submission'
select pg_temp.as_person('11111111-1111-1111-1111-100000000006');
set role authenticated;

do $$
declare
  n int;
begin
  select count(*) into n
  from submissions
  where id = 'aaaaaaaa-1111-1111-1111-a00000000001';
  if n <> 1 then
    raise exception 'Member could not read their own submission';
  end if;
end;
$$;

reset role;

\echo '--- TEST 7: a lead cannot read a safety escalation'
select pg_temp.as_person('11111111-1111-1111-1111-100000000003');
set role authenticated;

do $$
declare
  n int;
begin
  select count(*) into n
  from escalations
  where category = 'safety';
  if n <> 0 then
    raise exception 'Campus lead read a safety escalation';
  end if;
end;
$$;

reset role;

\echo '--- TEST 8: coordinator can read a safety escalation'
select pg_temp.as_person('11111111-1111-1111-1111-100000000002');
set role authenticated;

do $$
declare
  n int;
begin
  select count(*) into n
  from escalations
  where category = 'safety';
  if n <> 1 then
    raise exception 'Coordinator could not read a safety escalation';
  end if;
end;
$$;

reset role;

\echo '--- TEST 9: inactive status revokes reads'
update people
set status = 'inactive'
where id = '11111111-1111-1111-1111-100000000006';

select pg_temp.as_person('11111111-1111-1111-1111-100000000006');
set role authenticated;

do $$
declare
  n int;
begin
  select count(*) into n from submissions;
  if n <> 0 then
    raise exception 'inactive member still read submissions';
  end if;
end;
$$;

reset role;

update people
set status = 'verified'
where id = '11111111-1111-1111-1111-100000000006';

\echo '--- 0003 rls tests finished'
