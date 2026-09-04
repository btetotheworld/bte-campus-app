\set ON_ERROR_STOP 0

-- fixtures
insert into institutions (id,name) values ('11111111-1111-1111-1111-111111111111','Unilag');
insert into people (id,full_name,email) values
 ('aaaaaaaa-0000-0000-0000-000000000001','Lead A','a@x.com'),
 ('aaaaaaaa-0000-0000-0000-000000000002','Asst B','b@x.com');
insert into fellowships (id,institution_id,name) values
 ('ffffffff-0000-0000-0000-000000000001','11111111-1111-1111-1111-111111111111','Fellowship One'),
 ('ffffffff-0000-0000-0000-000000000002','11111111-1111-1111-1111-111111111111','Fellowship Two');
insert into departments (id,name,kind) values ('dddddddd-0000-0000-0000-000000000001','BTE Campus - Unilag','campus_chapter');
insert into campus_chapters (id,department_id,institution_id,lead_person_id,assistant_person_id)
 values ('cccccccc-0000-0000-0000-000000000001','dddddddd-0000-0000-0000-000000000001','11111111-1111-1111-1111-111111111111','aaaaaaaa-0000-0000-0000-000000000001','aaaaaaaa-0000-0000-0000-000000000002');
insert into chapter_approvals (chapter_id) values ('cccccccc-0000-0000-0000-000000000001');

\echo '--- TEST 1: peer risk, second live approach on same institution should FAIL'
insert into fellowship_approaches (fellowship_id,institution_id,opened_by,window_closes_at)
 values ('ffffffff-0000-0000-0000-000000000001','11111111-1111-1111-1111-111111111111','aaaaaaaa-0000-0000-0000-000000000001', current_date + 14);
insert into fellowship_approaches (fellowship_id,institution_id,opened_by,window_closes_at)
 values ('ffffffff-0000-0000-0000-000000000002','11111111-1111-1111-1111-111111111111','aaaaaaaa-0000-0000-0000-000000000001', current_date + 14);

\echo '--- TEST 2: chapter active with 7 of 8 gates should FAIL'
update chapter_approvals set gate1_people=true,gate2_selection=true,gate3_fellowship=true,
 gate4_venue=true,gate5_commitment=true,gate6_onboarding=true,gate7_systems=true
 where chapter_id='cccccccc-0000-0000-0000-000000000001';
update campus_chapters set status='active' where id='cccccccc-0000-0000-0000-000000000001';

\echo '--- TEST 3: with gate 8 confirmed it should SUCCEED'
update chapter_approvals set gate8_letter=true where chapter_id='cccccccc-0000-0000-0000-000000000001';
update campus_chapters set status='active' where id='cccccccc-0000-0000-0000-000000000001';
select status from campus_chapters where id='cccccccc-0000-0000-0000-000000000001';

\echo '--- TEST 4: lead and assistant same person should FAIL'
update campus_chapters set assistant_person_id='aaaaaaaa-0000-0000-0000-000000000001' where id='cccccccc-0000-0000-0000-000000000001';

\echo '--- TEST 5: observer submitting work should FAIL'
insert into chapter_members (chapter_id,person_id,status) values ('cccccccc-0000-0000-0000-000000000001','aaaaaaaa-0000-0000-0000-000000000002','observer');
insert into submissions (chapter_id,person_id,title,description) values ('cccccccc-0000-0000-0000-000000000001','aaaaaaaa-0000-0000-0000-000000000002','App','Does a thing');

\echo '--- TEST 6: member submitting should SUCCEED, and review window auto-set to 21 days'
update chapter_members set status='member' where person_id='aaaaaaaa-0000-0000-0000-000000000002';
insert into submissions (id,chapter_id,person_id,title,description) values ('55555555-0000-0000-0000-000000000001','cccccccc-0000-0000-0000-000000000001','aaaaaaaa-0000-0000-0000-000000000002','App','Does a thing');
insert into reviews (submission_id) values ('55555555-0000-0000-0000-000000000001');
select (due_at::date - current_date) as window_days from reviews;

\echo '--- TEST 7: shortened Shift with no reason should FAIL'
insert into terms (id,chapter_id,academic_year,term_number) values ('eeeeeeee-0000-0000-0000-000000000001','cccccccc-0000-0000-0000-000000000001','2026/27',1);
insert into meetings (id,chapter_id,term_id,meeting_number,scheduled_for) values ('bbbbbbbb-0000-0000-0000-000000000001','cccccccc-0000-0000-0000-000000000001','eeeeeeee-0000-0000-0000-000000000001',1, now());
insert into meeting_reports (meeting_id,filed_by,attendance_total,practitioner_block,demonstrators,blocked,submissions_noted,shift_ran)
 values ('bbbbbbbb-0000-0000-0000-000000000001','aaaaaaaa-0000-0000-0000-000000000001',12,'Career talk','Two demos','One stuck','None','shortened');

\echo '--- TEST 8: succession, assistant graduating same year as lead should FAIL'
insert into succession_records (chapter_id,lead_graduation_year,assistant_graduation_year) values ('cccccccc-0000-0000-0000-000000000001',2027,2027);
