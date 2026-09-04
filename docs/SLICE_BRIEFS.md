# SLICE_BRIEFS.md

One brief per engineer. Hand out at Phase 8, not before.

**These are not issuable until `docs/SLICE_PATTERN.md` exists.** That file comes out of the meetings slice being built first, by one person. Five engineers building against a written pattern converge; five building against a blank folder produce five architectures.

Every brief assumes `AGENTS.md`, `DESIGN_SYSTEM.md`, `DATA_MODEL.md`, `ARCHITECTURE.md` and `SLICE_PATTERN.md` have been read. None of them repeats what is in those files.

---

## Shared rules

**You own** your route group under `app/(platform)/campus/`, your server actions, and components used only by you.

**You do not touch** `db/`, `lib/schemas/`, `lib/auth/`, `lib/actions/`, `components/ui/`, the Tailwind config, ESLint config, CI, or anything in `docs/`. If your feature needs a change there, raise it and wait. This is the rule most likely to be broken by an agent trying to make a build pass.

**Business rules are already encoded** in `lib/schemas/` and in database constraints. Do not reimplement them in a component, and do not work around one that rejects your write. If a constraint blocks something the feature needs, the feature is probably wrong.

**Every view** implements loading, empty and error states. A list without an empty state is not finished.

---

## 1. applications

Runs the recruitment cycle from open to outcome.

**Screens**

- Application form for a pair, multi-step, saves as draft. Includes the fellowship scorecard form (see dependency below).
- Coordinator review queue, filterable by cohort and status.
- Scoring screen implementing the seven weighted rubric dimensions, showing the weighted total live.
- Interview scheduling, and the six-dimension interview scorecard.
- Outcome issuing: offer, conditional offer, decline, generated from the templates.

**Tables** `applications` · `application_scores` · `interviews`. Read only: `cohorts`, `institutions`, `people`.

**Rules that must be visible in the UI**

- Eligibility is checked at submit, not at review. An ineligible pair is told why before they finish.
- Applicants never see scores or interview scorecards. Not a hidden field — not queryable by them at all.
- A conditional offer sets a sixty-day deadline. Show days remaining, and show it going red.
- Outcomes are issued as a batch. The interface should make sending them one at a time awkward, because applicants on one campus talk to each other.
- The interview scorecard's "is the Assistant real" dimension gets visual prominence over the other five. It is the reason the interview exists.

**Dependency** The fellowship scorecard form component is owned by `chapters`. Import it; do not build a second one.

**Done when** a pair can apply, be scored, be interviewed, and receive an outcome, with every state visible to the coordinator.

---

## 2. chapters

Fellowship selection through to an approved chapter.

**Screens**

- Fellowship directory by institution.
- Approach tracker showing which fellowship has the live conversation and when the two-week window closes.
- Fellowship scorecard: form and review view. Owned here, consumed by `applications`.
- The eight-gate approval checklist, each gate carrying evidence, who confirmed it, and when.
- Chapter record: leads, fellowship, cohort, status, history.

**Tables** `fellowships` · `fellowship_approaches` · `fellowship_scorecards` · `campus_chapters` · `chapter_approvals` · `open_meeting_confirmations`.

**Rules that must be visible in the UI**

- One live approach per institution. The database enforces it; the UI should explain the rejection rather than showing a raw constraint error.
- A scorecard with a FAIL reliability result cannot back an approval. Say so on the scorecard, not at the gate.
- Gate 8, the fellowship letter, is last and only the founder confirms it. Seven green gates and a chapter still does not launch.
- Conditional approval shows its sixty-day clock.
- Status cannot reach `active` with any gate open. Show which gate is blocking.

**Done when** a fellowship can be recorded, scored, approved through eight gates, and a chapter goes active.

---

## 3. meetings — reference slice

Built first, by one person, in Phase 7. Everything else copies its pattern.

**Screens**

- Meeting list per chapter with the term's four dates.
- Schedule a meeting.
- File a report: the five fields, the Shift confirmation, the coordinator flags box.
- Coordinator view across all chapters, unread flags first.

**Tables** `terms` · `meetings` · `meeting_reports`.

**Rules that must be visible in the UI**

- Filing takes under three minutes. Time it. If it does not, the form is wrong.
- The flags box is optional and blank is a normal answer. Do not imply otherwise.
- `shift_ran` other than `full` requires a reason. Frame it neutrally — a lead who fears the question will lie, and the reporting becomes useless.
- The gap between `scheduled_for` and `filed_at` is a health signal. Surface it, do not hide it.

**Done when** the flow works end to end, is tested, and `SLICE_PATTERN.md` documents how it was built.

---

## 4. members

The roster and the thing that keeps a chapter alive between meetings.

**Screens**

- Chapter roster with member and observer status.
- Member detail: attendance, build logs, submissions.
- Build log feed per chapter, most recent first.
- Post a build log: shipped, learned, or stuck.

**Tables** `chapter_members` · `build_logs`.

**Rules that must be visible in the UI**

- Observer status is set by a scheduled job from attendance plus build logs per term. No lead ever marks someone an observer by hand.
- Observer is reversible and framed that way. "Post a build log and you are back", not "inactive".
- Stuck is a first-class post type, presented level with shipped and learned. Not a lesser option in a dropdown.
- Observers cannot submit work. Explain why, with the route back.

**Done when** the roster reflects real activity without a lead maintaining it.

---

## 5. submissions

Student work in, written review out.

**Screens**

- Submit work: title, description, links, media.
- Chapter submission list for the lead.
- Coordinator review queue, sorted by due date, overdue first and loud.
- Write a review.

**Tables** `submissions` · `reviews`.

**Rules that must be visible in the UI**

- Only members submit. Observers get the explanation, not a disabled button with no reason.
- `due_at` is the most prominent thing in the review queue. A missed review window is the fastest way to teach a chapter that BTE does not keep its word.
- The only outcomes are: reviewed, and offered expo floor space. There is no publication field, no ranking, no badge, no investor route. Do not add one "for later".
- Submitting unfinished work is normal. Say so in the form.

**Blocked, and the brief should say so out loud:** there is no named reviewer, no rubric and no agreed turnaround window. Build the pipeline; the review standard is a decision someone at BTE has to make, and the first chapter will expose it about six weeks after launching.

---

## 6. health

What the Coordinator looks at to find a failing chapter before it fails.

**Screens**

- Coordinator dashboard: every chapter with health signals, at-risk first.
- Chapter health detail: attendance trend, report punctuality, build log volume, Shift delivery.
- Succession audit, per term, per chapter.
- Termly rollup for the founder.

**Tables** `succession_records`. Read across: `meetings`, `meeting_reports`, `build_logs`, `chapter_members`, `campus_chapters`.

**Rules that must be visible in the UI**

- Implement the seven signals from the Coordinator Handbook, in the order they appear. A late report is nothing; two in a row is the earliest reliable signal.
- Silence is a risk state. A chapter that stops reporting is at risk regardless of what it says about itself, and the dashboard should say so.
- A chapter with no assistant for sixty days raises an escalation automatically. Not a reminder to the coordinator, an escalation.
- `assistant_is_real` is a recorded human judgement, never computed. Present it as a question the coordinator answers.

**Done when** a coordinator can open one screen and know which chapter to call today.

---

## 7. notifications

Mostly background. Small surface, high consequence.

**Screens**

- Template management.
- Send log.
- Manual send for outcome batches.

**Tables** `escalations`. Brevo integration in `lib/`, coordinated with the foundation owner.

**Sends**

- Outcome letters, batched, same day.
- Meeting reminders to leads.
- Report-overdue nudges.
- Review-window alerts to the coordinator before a review goes overdue, not after.
- Escalation notifications. `safety` pages immediately and does not queue.

**Rules**

- No template mentions money in any direction. Not a disclaimer either.
- No template promises publication, ranking, badges or investors.
- No em dashes.
- Every template is previewable before send, and a preview shows real data from a real record.

**Done when** a coordinator never learns about an overdue review from a student.

---

## Reviewing these slices

Read for intent, not syntax. CI reads every line for correctness; it cannot tell whether a feature does what the document says.

The three things most likely to be wrong and to pass review anyway: an eligibility rule reimplemented slightly differently in a component, a promise appearing in UI copy that BTE cannot keep, and a constraint worked around rather than respected. Check for those specifically.
