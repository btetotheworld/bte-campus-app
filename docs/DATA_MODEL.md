# DATA_MODEL.md

Authoritative schema for the BTE platform. Derived from the BTE Campus document set, not inferred.

**Agents:** do not add, rename or drop a table or column. Do not weaken a constraint to make a write succeed. If a feature appears to need a schema change, stop and say so.

Every rule in section 4 exists because it appears in a governing document. Where a business rule can be enforced by the database, it is enforced there, because six features written by six people will otherwise each enforce it slightly differently.

---

## 1. Shape

Two layers.

**Platform core** — people, departments, roles, badges. Shared by every part of BTE, not campus-specific. Campus does not duplicate any of it.

**Campus module** — everything else here. Attached to the core, never parallel to it.

The load-bearing decision: **a campus chapter is a department.** It is a row in `departments` with `kind = 'campus_chapter'`, extended by `campus_chapters`. Campus leads are people with a membership. There is no separate students table, no separate auth, no second definition of who somebody is.

---

## 2. Platform core

### people

Everyone BTE knows: staff, volunteers, campus leads, students.

`id` · `full_name` · `email` (unique) · `phone` · `status` · `created_at` · `verified_at`

`status`: `pending` → `verified` → `hidden` → `inactive`. The existing volunteer lifecycle. Campus roles use it unchanged.

### departments

Organisational units. Campus chapters are one kind.

`id` · `name` · `kind` (`team` | `campus_chapter`) · `parent_id` · `created_at` · `archived_at`

### memberships

A person's role in a department, over time. A person may hold several.

`id` · `person_id` · `department_id` · `role` · `started_at` · `ended_at`

`role`: `founder` · `coordinator` · `campus_lead` · `assistant_lead` · `practitioner` · `member`

Ended memberships are retained. Succession history depends on them.

### badges

Bezalel tenure. Awarded on membership duration, not on campus activity.

`id` · `person_id` · `badge` (`called` | `filled` | `skilled`) · `awarded_at`

Students hold no tenure badge. Recognition for a student runs through `submissions`.

---

## 3. Campus module

### institutions

`id` · `name` · `city` · `created_at`

### cohorts

One recruitment cycle.

`id` · `name` · `academic_year` · `applications_open_at` · `applications_close_at` · `interviews_from` · `interviews_to` · `outcomes_at` · `onboarding_call_at` · `chapters_cap` · `status`

`chapters_cap` is the deliberate growth brake. It reflects interview capacity, not demand.

### fellowships

Prospective and actual host fellowships.

`id` · `institution_id` · `name` · `leader_name` · `leader_role` · `contact_phone` · `contact_email` · `created_at`

### fellowship_approaches

Exists solely to enforce peer risk: one live approach per institution at a time.

`id` · `fellowship_id` · `institution_id` · `opened_by` · `opened_at` · `window_closes_at` · `outcome` (`live` | `declined` | `accepted` | `lapsed`) · `closed_at`

### fellowship_scorecards

Completed by the applicant. Section A is the gate.

`id` · `application_id` · `fellowship_id`
Reliability test: `ask_description` · `asked_on` · `replied_on` · `did_reply` · `did_show` · `was_done` · `delegation` · `reliability_result` (`pass` | `concern` | `fail`)
Criteria 2 to 5: `score_media_unit` · `score_venue` · `score_open_meeting` · `score_size`, each 0–3, plus an evidence text column each
Venue: `venue_permanent` · `venue_power` · `venue_capacity` · `venue_safe_access` · `venue_seen` · `proposed_day_time`
Disclosure: `applicant_attends` · `applicant_role` · `close_relation_leads`
`recommendation` · `submitted_at`

### applications

One per pair.

`id` · `cohort_id` · `institution_id` · `lead_person_id` · `assistant_person_id` (nullable) · `track_record` · `video_url` · `answer_problem` · `answer_faith_method` · `answer_failure` · `availability_note` · `status` · `submitted_at`

`status`: `draft` → `submitted` → `under_review` → `interview` → `offered` | `conditional` | `declined` | `withdrawn` | `lapsed`

`conditional_deadline` — sixty days from a conditional offer. The application lapses if no assistant is named.

### application_scores

The rubric. Weights are stored so a historic score stays interpretable if the rubric is revised.

`id` · `application_id` · `reviewer_id`
`score_groundwork` (×3) · `score_track_record` (×2) · `score_written` (×2) · `score_video` (×2) · `score_pair` (×2) · `score_availability` (×1) · `score_technical` (×1)
`weighted_total` (generated) · `red_flags` · `decision` · `scored_at`

### interviews

`id` · `application_id` · `interviewer_id` · `held_at`
`score_groundwork_holds` · `score_assistant_real` · `score_holds_room` · `score_escalates` · `score_works_in_system` · `score_honest` — each 0–3
`total` (generated) · `concern_note` · `recommendation` · `scored_at`

`score_assistant_real` is the one the interview exists to produce. Surface it in the UI accordingly.

### campus_chapters

Extends `departments`.

`id` · `department_id` (unique) · `institution_id` · `fellowship_id` · `cohort_id` · `lead_person_id` · `assistant_person_id` · `status` · `launched_at` · `closed_at`

`status`: `approved` → `active` → `at_risk` → `dormant` → `closed`

### chapter_approvals

The eight gates. One row per chapter, each gate carrying evidence and who confirmed it.

`id` · `chapter_id`
`gate1_people` · `gate2_selection` · `gate3_fellowship` · `gate4_venue` · `gate5_commitment` · `gate6_onboarding` · `gate7_systems` · `gate8_letter`
Each gate has `_confirmed_at` and `_confirmed_by`.
`conditional` · `conditional_deadline` · `outcome` · `decided_at` · `coordinator_id` · `countersigned_by`

Gate 8 is the fellowship letter and it is last by design. A chapter clearing seven gates still does not launch.

### open_meeting_confirmations

`id` · `chapter_id` · `fellowship_id` · `host_signatory_name` · `host_signatory_role` · `signed_at` · `academic_year` · `document_url`

### terms

`id` · `chapter_id` · `academic_year` · `term_number` (1 | 2) · `dates_published_at`

### meetings

`id` · `chapter_id` · `term_id` · `meeting_number` (1–4) · `scheduled_for` · `format` (`ninety` | `sixty`) · `status`

### meeting_reports

The five fields, plus the Shift confirmation and the flags box.

`id` · `meeting_id` · `filed_by` · `filed_at`
`attendance_total` · `first_timers`
`practitioner_block` · `practitioner_person_id`
`demonstrators` · `blocked` · `submissions_noted`
`shift_ran` (`full` | `shortened` | `missed`) · `shift_reason` · `shift_feedback`
`coordinator_flags` · `flags_read_at` · `flags_read_by`

`filed_at` on the meeting date is the standard. Divergence between `scheduled_for` and `filed_at` is the health signal — expose it rather than hiding it.

### chapter_members

`id` · `chapter_id` · `person_id` · `status` (`member` | `observer`) · `joined_at` · `status_changed_at`

Observer status is derived from attendance plus build logs per term, and set by a job, not by a lead's judgement.

### build_logs

`id` · `chapter_id` · `person_id` · `term_id` · `kind` (`shipped` | `learned` | `stuck`) · `body` · `posted_at`

### submissions

`id` · `chapter_id` · `person_id` · `title` · `description` · `links` · `media_urls` · `submitted_at` · `status`

`status`: `submitted` → `in_review` → `reviewed` → `expo_offered`

Nothing here records publication, ranking, badges or investor introductions. Those do not exist and the schema should not imply they do.

### reviews

`id` · `submission_id` · `reviewer_id` · `due_at` · `body` · `outcome` · `returned_at`

`due_at` is the promised turnaround. A review past due is the most damaging thing this product can do to a chapter, so it is a first-class field and not a computed afterthought.

### succession_records

`id` · `chapter_id` · `term_id` · `lead_person_id` · `assistant_person_id` · `lead_graduation_year` · `assistant_graduation_year` · `assistant_is_real` · `overlap_started_at` · `handover_completed_at` · `audited_at` · `audited_by` · `notes`

`assistant_is_real` is the coordinator's recorded judgement, not a computed value.

### escalations

`id` · `chapter_id` · `raised_by` · `category` · `body` · `raised_at` · `acknowledged_at` · `resolved_at` · `escalated_to_founder_at`

`category`: `money` · `press` · `fellowship` · `safety` · `name_use` · `signature` · `chapter_slipping`

`safety` bypasses normal queuing. Treat it as a page, not an inbox item.

### shift_packs

`id` · `term_number` · `session_number` · `title` · `anchor_reference` · `version` · `published_at`

Meeting reports reference the version delivered, so revision feedback stays attributable.

---

## 4. Invariants

Enforce in the database. Not in a component.

**Eligibility**

- `lead_person_id <> assistant_person_id`
- Lead and assistant year groups differ
- Lead graduation year is at least one full academic year out
- Assistant graduation year is at least two full academic years out

**Approval**

- `campus_chapters.status` cannot become `active` unless all eight gates on `chapter_approvals` are true
- One active chapter per institution
- A chapter cannot be approved against a scorecard with `reliability_result = 'fail'`

**Peer risk**

- Partial unique index on `fellowship_approaches (institution_id) WHERE outcome = 'live'`

**Conditional offers**

- `conditional_deadline` is exactly sixty days after a conditional offer
- A job lapses applications past their deadline with no assistant named

**Meeting reports**

- All five fields not null
- `shift_reason` required when `shift_ran <> 'full'`
- One report per meeting

**Submissions**

- Only a person with `chapter_members.status = 'member'` may submit. Observers may not.

**Succession**

- A chapter with a null `assistant_person_id` for more than sixty days raises an escalation automatically

---

## 5. Access

RLS on every table. No exceptions, including lookup tables.

| Role             | Sees                                                               | Writes                                                |
| ---------------- | ------------------------------------------------------------------ | ----------------------------------------------------- |
| `founder`        | Everything                                                         | Everything                                            |
| `coordinator`    | Everything in campus                                               | Everything except gate 8 and chapter closure          |
| `campus_lead`    | Own chapter only                                                   | Meeting reports, members, escalations for own chapter |
| `assistant_lead` | Own chapter only                                                   | Same as lead                                          |
| `practitioner`   | Own chapter, read only                                             | Nothing                                               |
| `member`         | Own chapter's meetings and build logs; own submissions and reviews | Own build logs, own submissions                       |
| Applicant        | Own application and scorecard, before submission                   | Own application, until submitted                      |

Three that are easy to get wrong:

- **Applicants cannot see their own scores or interview scorecards.** Ever. Outcomes are communicated by letter.
- **A campus lead cannot see another chapter's reports.** Cohort camaraderie is social, not a data permission.
- **A member cannot see another member's submission or review.**

---

## 6. Notes for whoever extends this

Feature tables that do not exist yet, deliberately: publication, ranking, innovation badges, investor introductions, TTT curriculum, multi-campus rollout. Each is deferred in the Charter pending a real owner and process. Do not add speculative tables for them — an empty `rankings` table invites a UI that promises something BTE cannot deliver.

When the Innovation Showcase gets an owner, extend `reviews` rather than building a parallel structure.
