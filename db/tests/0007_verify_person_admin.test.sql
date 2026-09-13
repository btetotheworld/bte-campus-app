-- 0007_verify_person_admin.test.sql
-- Admin verify override (P9). Never run as postgres.

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
  if to_regprocedure('public.verify_person_by_admin(uuid)') is null then
    raise exception 'verify_person_by_admin is missing. Apply 0007_verify_person_admin.sql';
  end if;
end;
$$;

-- Fatima is seeded pending community. Reset her if a prior test run verified her.
update people
set status = 'pending', verified_at = null
where id = '11111111-1111-1111-1111-100000000011';

delete from badges
where person_id = '11111111-1111-1111-1111-100000000011'
  and badge = 'called';

\echo '--- TEST 1: founder verifies a pending person and writes audit'
select pg_temp.as_person('11111111-1111-1111-1111-100000000001');
set role authenticated;
select verify_person_by_admin('11111111-1111-1111-1111-100000000011');
reset role;

do $$
begin
  if not exists (
    select 1 from people
    where id = '11111111-1111-1111-1111-100000000011'
      and status = 'verified'
      and verified_at is not null
  ) then
    raise exception 'Fatima was not verified';
  end if;

  if exists (
    select 1 from badges
    where person_id = '11111111-1111-1111-1111-100000000011'
      and badge = 'called'
  ) then
    raise exception 'Community person should not receive the Called badge';
  end if;

  if not exists (
    select 1 from audit_log
    where action = 'person_status_change'
      and entity = 'people'
      and entity_id = '11111111-1111-1111-1111-100000000011'
      and actor_id = '11111111-1111-1111-1111-100000000001'
      and metadata ->> 'from_status' = 'pending'
      and metadata ->> 'to_status' = 'verified'
  ) then
    raise exception 'Admin verification was not audited';
  end if;
end;
$$;

\echo '--- TEST 2: coordinator without people update cannot verify'
insert into people (id, full_name, email, status, kind, pending_since)
values (
  'aaaaaaaa-0000-0000-0000-000000000094',
  'Another Pending Volunteer',
  'another.pending@example.org',
  'pending',
  'team',
  now() - interval '91 days'
)
on conflict (id) do update
set status = 'pending', verified_at = null;

select pg_temp.as_person('11111111-1111-1111-1111-100000000002');
set role authenticated;
\set ON_ERROR_STOP 0
select verify_person_by_admin('aaaaaaaa-0000-0000-0000-000000000094');
\set ON_ERROR_STOP 1
reset role;

do $$
begin
  if exists (
    select 1 from people
    where id = 'aaaaaaaa-0000-0000-0000-000000000094'
      and status = 'verified'
  ) then
    raise exception 'Emeka should not have verified the pending volunteer';
  end if;
end;
$$;
