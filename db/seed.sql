-- db/seed.sql
-- Development seed data for the BTE platform.
--
-- One cohort, two chapters, and one person per access role documented in
-- docs/DATA_MODEL.md section 5 ("Access"):
--
--   founder        -> Ada Okafor       (platform-wide, everything)
--   coordinator    -> Emeka Chukwu     (everything in campus, except gate 8 / closure)
--   campus_lead    -> Tobi Adeyemi     (UNILAG chapter lead)
--   assistant_lead -> Ngozi Umeh       (UNILAG assistant lead)
--   practitioner   -> Chidi Eze        (UNILAG, read only)
--   member         -> Bisi Lawal       (UNILAG, own chapter + own submissions)
--   Applicant      -> Fatima Bello     (application only, no membership yet)
--
-- A second chapter (OAU) and a second member (Kunle / Grace / Ibrahim) exist
-- so cross-chapter isolation has something real to be tested against, and an
-- observer (Femi Bello) exists so the member/observer distinction in
-- chapter_members is exercised too.
--
-- Safe to run repeatedly against a freshly reset database: `pnpm run db:reset`
-- reapplies migrations then this file. It is not written to be idempotent
-- against a database that already has this seed in it.

begin;

-- ============================================================
-- People
-- ============================================================
insert into people (id, full_name, email, status) values
  ('11111111-1111-1111-1111-100000000001', 'Ada Okafor',     'ada.founder@example.org',       'verified'),
  ('11111111-1111-1111-1111-100000000002', 'Emeka Chukwu',   'emeka.coordinator@example.org', 'verified'),
  ('11111111-1111-1111-1111-100000000003', 'Tobi Adeyemi',   'tobi.lead@example.org',         'verified'),
  ('11111111-1111-1111-1111-100000000004', 'Ngozi Umeh',     'ngozi.assistant@example.org',   'verified'),
  ('11111111-1111-1111-1111-100000000005', 'Chidi Eze',      'chidi.practitioner@example.org','verified'),
  ('11111111-1111-1111-1111-100000000006', 'Bisi Lawal',     'bisi.member@example.org',       'verified'),
  ('11111111-1111-1111-1111-100000000007', 'Femi Bello',     'femi.observer@example.org',     'verified'),
  ('11111111-1111-1111-1111-100000000008', 'Kunle Afolabi',  'kunle.lead2@example.org',       'verified'),
  ('11111111-1111-1111-1111-100000000009', 'Grace Nwosu',    'grace.assistant2@example.org',  'verified'),
  ('11111111-1111-1111-1111-100000000010', 'Ibrahim Sule',   'ibrahim.member2@example.org',   'verified'),
  ('11111111-1111-1111-1111-100000000011', 'Fatima Bello',   'fatima.applicant@example.org',  'pending');

-- ============================================================
-- Campus module: institutions, fellowships, cohort
-- ============================================================
insert into institutions (id, name, city) values
  ('22222222-2222-2222-2222-200000000001', 'University of Lagos',              'Lagos'),
  ('22222222-2222-2222-2222-200000000002', 'Obafemi Awolowo University',       'Ile-Ife'),
  ('22222222-2222-2222-2222-200000000003', 'University of Ibadan',             'Ibadan');

insert into fellowships (id, institution_id, name, leader_name, leader_role, contact_email) values
  ('33333333-3333-3333-3333-300000000001', '22222222-2222-2222-2222-200000000001',
   'Household of Faith Chapel, Akoka', 'Pastor Yemi Adisa', 'Lead Pastor', 'contact@hofc-akoka.example.org'),
  ('33333333-3333-3333-3333-300000000002', '22222222-2222-2222-2222-200000000002',
   'Grace Assembly, Ile-Ife', 'Pastor John Bakare', 'Lead Pastor', 'contact@grace-ileife.example.org');

insert into cohorts (
  id, name, academic_year, applications_open_at, applications_close_at,
  interviews_from, interviews_to, outcomes_at, onboarding_call_at,
  chapters_cap, status
) values (
  '44444444-4444-4444-4444-400000000001', '2026 Cohort', '2025/2026',
  '2025-08-01', '2025-09-15',
  '2025-09-22', '2025-10-03', '2025-10-10', '2025-10-18 16:00:00+01',
  3, 'active'
);

-- ============================================================
-- Departments (a campus chapter is a department, see DATA_MODEL.md 1)
-- ============================================================
insert into departments (id, name, kind) values
  ('55555555-5555-5555-5555-500000000001', 'BTE Campus Team', 'team');

insert into departments (id, name, kind, parent_id) values
  ('55555555-5555-5555-5555-500000000002', 'UNILAG Campus Chapter', 'campus_chapter',
   '55555555-5555-5555-5555-500000000001'),
  ('55555555-5555-5555-5555-500000000003', 'OAU Campus Chapter', 'campus_chapter',
   '55555555-5555-5555-5555-500000000001');

-- ============================================================
-- Applications that led to the two chapters, plus one standing application
-- with no chapter yet: this is the Applicant row in the access table.
-- ============================================================
insert into applications (
  id, cohort_id, institution_id, lead_person_id, assistant_person_id,
  track_record, video_url, answer_problem, answer_faith_method, answer_failure,
  availability_note, status, submitted_at
) values
  ('66666666-6666-6666-6666-600000000001', '44444444-4444-4444-4444-400000000001',
   '22222222-2222-2222-2222-200000000001',
   '11111111-1111-1111-1111-100000000003', '11111111-1111-1111-1111-100000000004',
   'Ran a coding club for two years in the fellowship.', 'https://example.org/video/unilag',
   'Students graduate without ever having shipped anything real.',
   'Weekly build nights with a devotion tied to the craft, not bolted on.',
   'Tried this once without fellowship buy-in and it fizzled after a term.',
   'Available every Saturday afternoon, term-time.', 'offered', '2025-09-10 12:00:00+01'),
  ('66666666-6666-6666-6666-600000000002', '44444444-4444-4444-4444-400000000001',
   '22222222-2222-2222-2222-200000000002',
   '11111111-1111-1111-1111-100000000008', '11111111-1111-1111-1111-100000000009',
   'Led a fellowship media unit for a year.', 'https://example.org/video/oau',
   'No structured way for students to practice their craft with accountability.',
   'Pair students with practitioners already in the fellowship.',
   'Underestimated how much logistics a weekly meeting needs.',
   'Available weekday evenings.', 'offered', '2025-09-11 09:30:00+01'),
  ('66666666-6666-6666-6666-600000000003', '44444444-4444-4444-4444-400000000001',
   '22222222-2222-2222-2222-200000000003',
   '11111111-1111-1111-1111-100000000011', null,
   'Volunteers with the fellowship media team.', 'https://example.org/video/ui',
   'Still drafting this answer.', 'Still drafting this answer.', 'Still drafting this answer.',
   'Weekends only for now.', 'submitted', '2025-09-14 18:00:00+01');

insert into fellowship_scorecards (
  application_id, fellowship_id,
  ask_description, asked_on, replied_on, did_reply, did_show, was_done, delegation,
  reliability_result,
  score_media_unit, score_venue, score_open_meeting, score_size,
  venue_permanent, venue_power, venue_capacity, venue_safe_access, venue_seen, proposed_day_time,
  applicant_attends, applicant_role, close_relation_leads,
  recommendation, submitted_at
) values
  ('66666666-6666-6666-6666-600000000001', '33333333-3333-3333-3333-300000000001',
   'Asked the media unit to print and post 20 flyers.', '2025-08-20', '2025-08-22',
   true, true, true, 'Delegated to two unit members, both showed up.',
   'pass', 2, 3, 2, 2,
   true, true, 60, true, true, 'Saturdays, 4pm',
   true, 'Media unit volunteer', false,
   'Reliable fellowship, good venue, recommend approval.', '2025-08-25 10:00:00+01'),
  ('66666666-6666-6666-6666-600000000002', '33333333-3333-3333-3333-300000000002',
   'Asked the welfare unit to organise a meet-and-greet.', '2025-08-21', '2025-08-24',
   true, true, true, 'Delegated to welfare unit lead.',
   'pass', 2, 2, 3, 2,
   true, true, 45, true, true, 'Wednesdays, 6pm',
   false, null, false,
   'Reliable fellowship, recommend approval.', '2025-08-26 11:00:00+01');

-- ============================================================
-- The two chapters. Inserted as 'approved' first (the column default),
-- then moved to 'active' only after chapter_approvals exists and all eight
-- gates are set, exactly like db/tests/0001_invariants.test.sql exercises.
-- ============================================================
insert into campus_chapters (
  id, department_id, institution_id, fellowship_id, cohort_id,
  lead_person_id, assistant_person_id, launched_at
) values
  ('77777777-7777-7777-7777-700000000001', '55555555-5555-5555-5555-500000000002',
   '22222222-2222-2222-2222-200000000001', '33333333-3333-3333-3333-300000000001',
   '44444444-4444-4444-4444-400000000001',
   '11111111-1111-1111-1111-100000000003', '11111111-1111-1111-1111-100000000004',
   '2025-10-20'),
  ('77777777-7777-7777-7777-700000000002', '55555555-5555-5555-5555-500000000003',
   '22222222-2222-2222-2222-200000000002', '33333333-3333-3333-3333-300000000002',
   '44444444-4444-4444-4444-400000000001',
   '11111111-1111-1111-1111-100000000008', '11111111-1111-1111-1111-100000000009',
   '2025-10-20');

insert into chapter_approvals (
  chapter_id,
  gate1_people, gate2_selection, gate3_fellowship, gate4_venue,
  gate5_commitment, gate6_onboarding, gate7_systems, gate8_letter,
  gate1_confirmed_at, gate1_confirmed_by, gate2_confirmed_at, gate2_confirmed_by,
  gate3_confirmed_at, gate3_confirmed_by, gate4_confirmed_at, gate4_confirmed_by,
  gate5_confirmed_at, gate5_confirmed_by, gate6_confirmed_at, gate6_confirmed_by,
  gate7_confirmed_at, gate7_confirmed_by, gate8_confirmed_at, gate8_confirmed_by,
  outcome, decided_at, coordinator_id, countersigned_by
) values
  ('77777777-7777-7777-7777-700000000001',
   true, true, true, true, true, true, true, true,
   now(), '11111111-1111-1111-1111-100000000002', now(), '11111111-1111-1111-1111-100000000002',
   now(), '11111111-1111-1111-1111-100000000002', now(), '11111111-1111-1111-1111-100000000002',
   now(), '11111111-1111-1111-1111-100000000002', now(), '11111111-1111-1111-1111-100000000002',
   now(), '11111111-1111-1111-1111-100000000002', now(), '11111111-1111-1111-1111-100000000002',
   'approved', now(), '11111111-1111-1111-1111-100000000002', '11111111-1111-1111-1111-100000000001'),
  ('77777777-7777-7777-7777-700000000002',
   true, true, true, true, true, true, true, true,
   now(), '11111111-1111-1111-1111-100000000002', now(), '11111111-1111-1111-1111-100000000002',
   now(), '11111111-1111-1111-1111-100000000002', now(), '11111111-1111-1111-1111-100000000002',
   now(), '11111111-1111-1111-1111-100000000002', now(), '11111111-1111-1111-1111-100000000002',
   now(), '11111111-1111-1111-1111-100000000002', now(), '11111111-1111-1111-1111-100000000002',
   'approved', now(), '11111111-1111-1111-1111-100000000002', '11111111-1111-1111-1111-100000000001');

update campus_chapters set status = 'active'
where id in ('77777777-7777-7777-7777-700000000001', '77777777-7777-7777-7777-700000000002');

-- ============================================================
-- Memberships: this is where each access-table role actually lives.
-- ============================================================
insert into memberships (person_id, department_id, role) values
  ('11111111-1111-1111-1111-100000000001', '55555555-5555-5555-5555-500000000001', 'founder'),
  ('11111111-1111-1111-1111-100000000002', '55555555-5555-5555-5555-500000000001', 'coordinator'),
  ('11111111-1111-1111-1111-100000000003', '55555555-5555-5555-5555-500000000002', 'campus_lead'),
  ('11111111-1111-1111-1111-100000000004', '55555555-5555-5555-5555-500000000002', 'assistant_lead'),
  ('11111111-1111-1111-1111-100000000005', '55555555-5555-5555-5555-500000000002', 'practitioner'),
  ('11111111-1111-1111-1111-100000000006', '55555555-5555-5555-5555-500000000002', 'member'),
  ('11111111-1111-1111-1111-100000000007', '55555555-5555-5555-5555-500000000002', 'member'),
  ('11111111-1111-1111-1111-100000000008', '55555555-5555-5555-5555-500000000003', 'campus_lead'),
  ('11111111-1111-1111-1111-100000000009', '55555555-5555-5555-5555-500000000003', 'assistant_lead'),
  ('11111111-1111-1111-1111-100000000010', '55555555-5555-5555-5555-500000000003', 'member');
-- Fatima Bello (applicant) intentionally holds no membership: an applicant is
-- identified by having an application and nothing else, per DATA_MODEL.md 5.

-- ============================================================
-- Chapter attendance roll. Femi Bello is seeded as an observer on purpose,
-- to exercise the member/observer split the submissions trigger checks.
-- ============================================================
insert into chapter_members (chapter_id, person_id, status) values
  ('77777777-7777-7777-7777-700000000001', '11111111-1111-1111-1111-100000000003', 'member'),
  ('77777777-7777-7777-7777-700000000001', '11111111-1111-1111-1111-100000000004', 'member'),
  ('77777777-7777-7777-7777-700000000001', '11111111-1111-1111-1111-100000000006', 'member'),
  ('77777777-7777-7777-7777-700000000001', '11111111-1111-1111-1111-100000000007', 'observer'),
  ('77777777-7777-7777-7777-700000000002', '11111111-1111-1111-1111-100000000008', 'member'),
  ('77777777-7777-7777-7777-700000000002', '11111111-1111-1111-1111-100000000009', 'member'),
  ('77777777-7777-7777-7777-700000000002', '11111111-1111-1111-1111-100000000010', 'member');

-- ============================================================
-- One term and one held meeting per chapter, with its report.
-- ============================================================
insert into terms (id, chapter_id, academic_year, term_number, dates_published_at) values
  ('88888888-8888-8888-8888-800000000001', '77777777-7777-7777-7777-700000000001',
   '2025/2026', 1, '2025-10-21 09:00:00+01'),
  ('88888888-8888-8888-8888-800000000002', '77777777-7777-7777-7777-700000000002',
   '2025/2026', 1, '2025-10-21 09:00:00+01');

insert into meetings (id, chapter_id, term_id, meeting_number, scheduled_for, format, status) values
  ('99999999-9999-9999-9999-900000000001', '77777777-7777-7777-7777-700000000001',
   '88888888-8888-8888-8888-800000000001', 1, '2025-11-01 16:00:00+01', 'ninety', 'held'),
  ('99999999-9999-9999-9999-900000000002', '77777777-7777-7777-7777-700000000002',
   '88888888-8888-8888-8888-800000000002', 1, '2025-11-05 18:00:00+01', 'ninety', 'held');

insert into meeting_reports (
  meeting_id, filed_by, attendance_total, first_timers,
  practitioner_block, practitioner_person_id, demonstrators, blocked, submissions_noted,
  shift_ran, shift_reason
) values
  ('99999999-9999-9999-9999-900000000001', '11111111-1111-1111-1111-100000000003',
   15, 3, 'Career talk on faithfulness in long, unglamorous building work.',
   '11111111-1111-1111-1111-100000000005',
   'Two members demoed a habit tracker they had been building.',
   'One member stuck on auth setup, paired with the assistant lead after the meeting.',
   'One submission noted for expo review.', 'full', null),
  ('99999999-9999-9999-9999-900000000002', '11111111-1111-1111-1111-100000000008',
   10, 2, 'Career talk on working with a difficult teammate.',
   null,
   'One member demoed a landing page.',
   'None reported.',
   'None yet this term.', 'shortened', 'Venue was double-booked, meeting ran sixty minutes instead of ninety.');

-- ============================================================
-- Build logs and a submission, to give the member role something to own.
-- ============================================================
insert into build_logs (chapter_id, person_id, term_id, kind, body) values
  ('77777777-7777-7777-7777-700000000001', '11111111-1111-1111-1111-100000000006',
   '88888888-8888-8888-8888-800000000001', 'shipped',
   'Shipped a v1 of my attendance tracker for the chapter.'),
  ('77777777-7777-7777-7777-700000000001', '11111111-1111-1111-1111-100000000007',
   '88888888-8888-8888-8888-800000000001', 'learned',
   'Learned how migrations work while following along with the build night.');

insert into submissions (id, chapter_id, person_id, title, description, status) values
  ('aaaaaaaa-1111-1111-1111-a00000000001', '77777777-7777-7777-7777-700000000001',
   '11111111-1111-1111-1111-100000000006', 'Chapter attendance tracker',
   'A small tool to log who showed up each week and flag first-timers.', 'in_review'),
  ('aaaaaaaa-1111-1111-1111-a00000000002', '77777777-7777-7777-7777-700000000002',
   '11111111-1111-1111-1111-100000000010', 'Landing page for the OAU chapter',
   'A one-page site introducing the chapter to prospective members.', 'submitted');

-- due_at is left unset so the reviews_default_window trigger fills it in at
-- now() + 21 days, the way it would for a real review.
insert into reviews (submission_id, reviewer_id) values
  ('aaaaaaaa-1111-1111-1111-a00000000001', '11111111-1111-1111-1111-100000000002');

commit;
