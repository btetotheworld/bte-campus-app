-- 0003_rls.sql
-- Enable row level security and create policies in the same transaction.
-- Enabling RLS without policies is an empty result, no error, and looks
-- like data vanished. Do not split this file.
--
-- Never test these policies as postgres. Superuser bypasses RLS.
-- Authoritative rules: docs/RBAC.md sections 7, 8 and 9.

revoke all on all tables in schema public from anon;
grant usage on schema public to authenticated;
grant select, insert, update, delete on all tables in schema public to authenticated;
grant usage, select on all sequences in schema public to authenticated;

-- ============================================================
-- Enable RLS on every public table. Policies follow immediately.
-- ============================================================

alter table people enable row level security;
alter table departments enable row level security;
alter table memberships enable row level security;
alter table badges enable row level security;
alter table institutions enable row level security;
alter table cohorts enable row level security;
alter table fellowships enable row level security;
alter table fellowship_approaches enable row level security;
alter table applications enable row level security;
alter table application_scores enable row level security;
alter table fellowship_scorecards enable row level security;
alter table interviews enable row level security;
alter table campus_chapters enable row level security;
alter table chapter_approvals enable row level security;
alter table open_meeting_confirmations enable row level security;
alter table terms enable row level security;
alter table meetings enable row level security;
alter table meeting_reports enable row level security;
alter table chapter_members enable row level security;
alter table build_logs enable row level security;
alter table submissions enable row level security;
alter table reviews enable row level security;
alter table succession_records enable row level security;
alter table escalations enable row level security;
alter table shift_packs enable row level security;
alter table platform_roles enable row level security;
alter table role_permissions enable row level security;
alter table audit_log enable row level security;

-- ============================================================
-- people. Contact stays on the row. The row is not globally readable.
-- ============================================================

create policy people_select on people
  for select
  using (
    is_active()
    and (
      id = current_person_id()
      or has_permission('people', 'read')
      or exists (
        select 1
        from memberships mine
        join memberships theirs
          on theirs.department_id = mine.department_id
         and theirs.ended_at is null
        where mine.person_id = current_person_id()
          and mine.ended_at is null
          and theirs.person_id = people.id
      )
      or exists (
        select 1
        from chapter_members mine
        join chapter_members theirs
          on theirs.chapter_id = mine.chapter_id
        where mine.person_id = current_person_id()
          and theirs.person_id = people.id
      )
    )
  );

create policy people_update on people
  for update
  using (
    is_active()
    and (
      id = current_person_id()
      or has_permission('people', 'update')
    )
  );

-- ============================================================
-- Directory and membership
-- ============================================================

create policy departments_select on departments
  for select
  using (
    is_active()
    and (
      has_permission('departments', 'read')
      or has_permission('chapters', 'read')
      or exists (
        select 1
        from memberships m
        where m.person_id = current_person_id()
          and m.ended_at is null
          and m.department_id = departments.id
      )
    )
  );

create policy departments_write on departments
  for all
  using (is_active() and has_permission('departments', 'update'))
  with check (is_active() and has_permission('departments', 'update'));

create policy memberships_select on memberships
  for select
  using (
    is_active()
    and (
      person_id = current_person_id()
      or has_permission('people', 'read')
      or has_scoped('people', 'read', department_id)
    )
  );

create policy memberships_write on memberships
  for all
  using (is_active() and has_permission('people', 'update'))
  with check (is_active() and has_permission('people', 'update'));

create policy badges_select on badges
  for select
  using (
    is_active()
    and (
      person_id = current_person_id()
      or has_permission('people', 'read')
    )
  );

-- ============================================================
-- Reference data. Signed-in and active is enough to read.
-- ============================================================

create policy institutions_select on institutions
  for select
  using (is_active());

create policy cohorts_select on cohorts
  for select
  using (is_active());

create policy fellowships_select on fellowships
  for select
  using (is_active());

create policy shift_packs_select on shift_packs
  for select
  using (is_active());

create policy role_permissions_select on role_permissions
  for select
  using (is_active());

-- ============================================================
-- Applications. An applicant reads their own row, never the scores.
-- ============================================================

create policy applications_select on applications
  for select
  using (
    is_active()
    and (
      lead_person_id = current_person_id()
      or assistant_person_id = current_person_id()
      or has_permission('campus_applications', 'read')
    )
  );

create policy applications_write on applications
  for all
  using (
    is_active()
    and (
      lead_person_id = current_person_id()
      or has_permission('campus_applications', 'update')
    )
  )
  with check (
    is_active()
    and (
      lead_person_id = current_person_id()
      or has_permission('campus_applications', 'update')
    )
  );

create policy application_scores_select on application_scores
  for select
  using (
    is_active()
    and (
      has_platform_role('founder')
      or has_platform_role('program_coordinator')
    )
  );

create policy application_scores_write on application_scores
  for all
  using (
    is_active()
    and (
      has_platform_role('founder')
      or has_platform_role('program_coordinator')
    )
  )
  with check (
    is_active()
    and (
      has_platform_role('founder')
      or has_platform_role('program_coordinator')
    )
  );

create policy fellowship_scorecards_select on fellowship_scorecards
  for select
  using (
    is_active()
    and (
      has_platform_role('founder')
      or has_platform_role('program_coordinator')
    )
  );

create policy interviews_select on interviews
  for select
  using (
    is_active()
    and (
      has_platform_role('founder')
      or has_platform_role('program_coordinator')
    )
  );

create policy fellowship_approaches_select on fellowship_approaches
  for select
  using (
    is_active()
    and (
      has_permission('fellowships', 'read')
      or has_permission('campus_applications', 'read')
    )
  );

-- ============================================================
-- Chapters, meetings, reports
-- ============================================================

create policy campus_chapters_select on campus_chapters
  for select
  using (
    is_active()
    and (
      has_permission('chapters', 'read')
      or is_member_of(id)
    )
  );

create policy campus_chapters_update on campus_chapters
  for update
  using (is_active() and has_permission('chapters', 'update'))
  with check (is_active() and has_permission('chapters', 'update'));

create policy chapter_approvals_select on chapter_approvals
  for select
  using (
    is_active()
    and (
      has_permission('approvals', 'confirm_gate')
      or has_permission('chapters', 'read')
      or is_member_of(chapter_id)
    )
  );

create policy open_meeting_confirmations_select on open_meeting_confirmations
  for select
  using (
    is_active()
    and (
      has_permission('chapters', 'read')
      or is_member_of(chapter_id)
    )
  );

create policy terms_select on terms
  for select
  using (
    is_active()
    and (
      has_permission('meetings', 'read')
      or has_scoped('meetings', 'read', chapter_department_id(chapter_id))
      or is_member_of(chapter_id)
    )
  );

create policy meetings_select on meetings
  for select
  using (
    is_active()
    and (
      has_permission('meetings', 'read')
      or has_scoped('meetings', 'read', chapter_department_id(chapter_id))
      or is_member_of(chapter_id)
    )
  );

create policy meetings_write on meetings
  for all
  using (
    is_active()
    and (
      has_permission('meetings', 'update')
      or has_scoped('meetings', 'update', chapter_department_id(chapter_id))
    )
  )
  with check (
    is_active()
    and (
      has_permission('meetings', 'update')
      or has_scoped('meetings', 'create', chapter_department_id(chapter_id))
    )
  );

create policy meeting_reports_select on meeting_reports
  for select
  using (
    is_active()
    and exists (
      select 1
      from meetings m
      where m.id = meeting_reports.meeting_id
        and (
          has_permission('reports', 'read')
          or has_scoped('reports', 'read', chapter_department_id(m.chapter_id))
        )
    )
  );

create policy meeting_reports_write on meeting_reports
  for all
  using (
    is_active()
    and exists (
      select 1
      from meetings m
      where m.id = meeting_reports.meeting_id
        and (
          has_permission('reports', 'create')
          or has_scoped('reports', 'create', chapter_department_id(m.chapter_id))
        )
    )
  )
  with check (
    is_active()
    and exists (
      select 1
      from meetings m
      where m.id = meeting_reports.meeting_id
        and (
          has_permission('reports', 'create')
          or has_scoped('reports', 'create', chapter_department_id(m.chapter_id))
        )
    )
  );

create policy chapter_members_select on chapter_members
  for select
  using (
    is_active()
    and (
      person_id = current_person_id()
      or has_permission('chapter_members', 'read')
      or has_scoped('chapter_members', 'read', chapter_department_id(chapter_id))
      or is_member_of(chapter_id)
    )
  );

create policy chapter_members_write on chapter_members
  for all
  using (
    is_active()
    and (
      has_permission('chapter_members', 'update')
      or has_scoped('chapter_members', 'update', chapter_department_id(chapter_id))
    )
  )
  with check (
    is_active()
    and (
      has_permission('chapter_members', 'update')
      or has_scoped('chapter_members', 'update', chapter_department_id(chapter_id))
    )
  );

create policy build_logs_select on build_logs
  for select
  using (
    is_active()
    and (
      person_id = current_person_id()
      or has_permission('build_logs', 'read')
      or has_scoped('build_logs', 'read', chapter_department_id(chapter_id))
    )
  );

create policy build_logs_insert on build_logs
  for insert
  with check (
    is_active()
    and person_id = current_person_id()
    and is_member_of(chapter_id)
  );

-- ============================================================
-- Submissions and reviews. A member does not see another member's work.
-- ============================================================

create policy submissions_select on submissions
  for select
  using (
    is_active()
    and (
      person_id = current_person_id()
      or has_permission('submissions', 'read')
    )
  );

create policy submissions_insert on submissions
  for insert
  with check (
    is_active()
    and person_id = current_person_id()
    and is_member_of(chapter_id)
  );

create policy reviews_select on reviews
  for select
  using (
    is_active()
    and (
      reviewer_id = current_person_id()
      or has_permission('reviews', 'read')
      or exists (
        select 1
        from submissions s
        where s.id = reviews.submission_id
          and s.person_id = current_person_id()
      )
    )
  );

create policy reviews_update on reviews
  for update
  using (
    is_active()
    and (
      reviewer_id = current_person_id()
      or has_permission('reviews', 'update')
    )
  );

-- ============================================================
-- Health. Safety escalations are founder and coordinator only.
-- ============================================================

create policy succession_select on succession_records
  for select
  using (
    is_active()
    and (
      has_permission('succession', 'read')
      or is_member_of(chapter_id)
    )
  );

create policy escalations_select on escalations
  for select
  using (
    is_active()
    and (
      (
        category <> 'safety'
        and (
          has_permission('escalations', 'read')
          or has_scoped('escalations', 'create', chapter_department_id(chapter_id))
        )
      )
      or (
        category = 'safety'
        and (
          has_platform_role('founder')
          or has_platform_role('program_coordinator')
        )
      )
    )
  );

create policy escalations_insert on escalations
  for insert
  with check (
    is_active()
    and (
      has_permission('escalations', 'create')
      or has_scoped('escalations', 'create', chapter_department_id(chapter_id))
    )
  );

-- ============================================================
-- Access tables
-- ============================================================

create policy platform_roles_select on platform_roles
  for select
  using (
    is_active()
    and (
      person_id = current_person_id()
      or has_permission('people', 'read')
      or has_platform_role('founder')
    )
  );

create policy platform_roles_insert on platform_roles
  for insert
  with check (is_active() and has_platform_role('founder'));

create policy platform_roles_delete on platform_roles
  for delete
  using (is_active() and has_platform_role('founder'));

create policy audit_log_select on audit_log
  for select
  using (is_active() and has_permission('audit', 'read'));

create policy audit_log_insert on audit_log
  for insert
  with check (is_active());
