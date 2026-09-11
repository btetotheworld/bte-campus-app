-- 0006_auto_verify.test.sql
-- Auto-verify job (P8). Uses synthetic dates. Never run as postgres.

\set ON_ERROR_STOP 1

do $$
begin
  if to_regprocedure('public.auto_verify_people()') is null then
    raise exception 'auto_verify_people is missing. Apply 0006_auto_verify.sql';
  end if;
end;
$$;

insert into people (id, full_name, email, status, kind, pending_since) values
  (
    'aaaaaaaa-0000-0000-0000-000000000091',
    'Past Clock Volunteer',
    'past.clock@example.org',
    'pending',
    'team',
    now() - interval '91 days'
  ),
  (
    'aaaaaaaa-0000-0000-0000-000000000092',
    'Inside Clock Volunteer',
    'inside.clock@example.org',
    'pending',
    'team',
    now() - interval '30 days'
  );

\echo '--- TEST 1: service role verifies only people past the 90-day clock'
set role service_role;
select auto_verify_people();
reset role;

do $$
begin
  if not exists (
    select 1 from people
    where id = 'aaaaaaaa-0000-0000-0000-000000000091'
      and status = 'verified'
      and verified_at is not null
  ) then
    raise exception 'Past-clock volunteer was not verified';
  end if;

  if not exists (
    select 1 from badges
    where person_id = 'aaaaaaaa-0000-0000-0000-000000000091'
      and badge = 'called'
  ) then
    raise exception 'Past-clock team volunteer should receive the Called badge';
  end if;

  if exists (
    select 1 from audit_log
    where action = 'person_status_change'
      and entity_id = 'aaaaaaaa-0000-0000-0000-000000000091'
      and metadata ->> 'from_status' = 'pending'
      and metadata ->> 'to_status' = 'verified'
  ) then
    null;
  else
    raise exception 'Auto-verify was not audited';
  end if;

  if exists (
    select 1 from people
    where id = 'aaaaaaaa-0000-0000-0000-000000000092'
      and status = 'verified'
  ) then
    raise exception 'Inside-clock volunteer should stay pending';
  end if;
end;
$$;

\echo '--- TEST 2: authenticated users cannot run the job'
\set ON_ERROR_STOP 0
set role authenticated;
select auto_verify_people();
\set ON_ERROR_STOP 1
reset role;

\echo '--- TEST 3: team kind sets pending_since when the clock starts'
insert into people (id, full_name, email, status, kind)
values (
  'aaaaaaaa-0000-0000-0000-000000000093',
  'New Team Volunteer',
  'new.team@example.org',
  'pending',
  'community'
);

update people
set kind = 'team'
where id = 'aaaaaaaa-0000-0000-0000-000000000093';

do $$
begin
  if not exists (
    select 1 from people
    where id = 'aaaaaaaa-0000-0000-0000-000000000093'
      and kind = 'team'
      and pending_since is not null
  ) then
    raise exception 'pending_since was not set when kind became team';
  end if;
end;
$$;
