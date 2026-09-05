-- 0004_person_kind.sql
-- One people table, one column of difference: a BTE volunteer (team) versus a
-- student or external submitter (community). docs/RBAC.md section 3.
-- community is the safe default: team is granted, never assumed.

create type person_kind as enum ('team', 'community');

alter table people
  add column kind person_kind not null default 'community';
