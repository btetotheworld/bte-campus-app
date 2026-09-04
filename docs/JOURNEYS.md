# JOURNEYS.md

Every user journey the BTE document set specifies, and the sprint order that follows from how they depend on each other.

This supersedes the sprint plan in `DELIVERY_PLAN.md` sections 4 and 5. That plan covered the campus module only and treated People Management as an existing dependency. It is not built, and campus depends on it.

---

## 1. Scope

**In the platform:** People Management (org-wide), BTE Campus, Innovation Showcase, and the public-facing surface of all three.

**Not in the platform, for now:** partnership and sponsorship management, MOU generation, expo ticketing, floor planning, finance. These have documents but no journey that needs software this year. Named here so nobody assumes they were forgotten.

**Two surfaces, one codebase.** This is not just an admin tool.

| Surface | Who                       | Examples                                                     |
| ------- | ------------------------- | ------------------------------------------------------------ |
| Public  | Anyone, unauthenticated   | Department pages, team listing, public profiles, apply forms |
| Admin   | Authenticated, role-gated | Everything else                                              |

---

## 2. Actors

| Actor                        | Exists as                   | Notes                                                                           |
| ---------------------------- | --------------------------- | ------------------------------------------------------------------------------- |
| Visitor                      | Nobody                      | Unauthenticated. Browses, applies.                                              |
| Applicant                    | Application record only     | **Not a person record yet.** This distinction matters and is easy to get wrong. |
| Volunteer                    | Person + membership         | The base state for everyone inside BTE                                          |
| Team Lead / Assistant        | Person + membership role    | Assigned to one department; a department may have several                       |
| Founder / Community Lead     | Person, no department       | Sits above the department structure, featured first publicly                    |
| Admin                        | Person + module permissions | Module-based RBAC, not all-or-nothing                                           |
| Campus Lead / Assistant Lead | Person + chapter membership | A chapter is a department                                                       |
| Practitioner                 | Person + chapter membership | Senior student, chapter-scoped                                                  |
| Chapter Member               | Person + chapter membership | Student. Member or observer.                                                    |
| Program Coordinator          | Person + permission bundle  | Campus operations                                                               |
| Showcase Owner / Reviewer    | Person + permission bundle  | Review and selection                                                            |
| Host Fellowship              | Record, not a user          | No login. Represented, not authenticated.                                       |

---

## 3. Journey inventory

Source in brackets. `P` People, `C` Campus, `S` Showcase, `X` cross-cutting.

### People Management

| #     | Journey                                                                                              | Source                                         |
| ----- | ---------------------------------------------------------------------------------------------------- | ---------------------------------------------- |
| `P1`  | Visitor browses departments and team, sees leads, assistants and volunteers                          | People Logic 1                                 |
| `P2`  | Visitor views a public profile: photo, bio, socials, badges                                          | People Logic 2, 4                              |
| `P3`  | Visitor applies through the general apply flow                                                       | People Logic 6                                 |
| `P4`  | Visitor applies through a department page, department pre-filled and locked                          | People Logic 6                                 |
| `P5`  | Admin reviews join applications and approves or rejects                                              | People Logic 6, 7                              |
| `P6`  | Admin creates a person record from an approved application                                           | People Logic 6, **gap: owner undefined**       |
| `P7`  | New person sits `pending`, not publicly visible                                                      | People Logic 3                                 |
| `P8`  | Person auto-verifies after configurable duration, default 90 days, becomes public                    | People Logic 3                                 |
| `P9`  | Admin manually overrides to verify immediately                                                       | People Logic 3                                 |
| `P10` | Person receives Called badge at 3 months, Filled at 1 year, Skilled at 2 years, with automatic email | People Logic 4                                 |
| `P11` | Admin creates and orders departments: name, description, photo, display order                        | People Logic 1                                 |
| `P12` | Admin assigns leads, assistants and volunteers to departments                                        | People Logic 1                                 |
| `P13` | Admin sets a person to `hidden` or `inactive` on exit, record retained                               | People Logic 3                                 |
| `P14` | Admin sees birthdays this month and sends a birthday email manually                                  | People Logic 5                                 |
| `P15` | Person maintains their own profile                                                                   | implied by P2                                  |
| `P16` | Admin sends templated communications to people or departments                                        | People Communications hub                      |
| `P17` | Department lead is notified when a pending volunteer lands in their department                       | People Logic 8, **not built, proposed**        |
| `P18` | Onboarding track across the 90-day pending period, 30-60-90 framework                                | Onboarding SOP, **not in platform**            |
| `P19` | Mentor or buddy assignment                                                                           | Onboarding Programme Plan, **no field exists** |

### BTE Campus

| #     | Journey                                                                         | Source                    |
| ----- | ------------------------------------------------------------------------------- | ------------------------- |
| `C1`  | Coordinator opens a cohort and sets the cap                                     | Cohort Timeline           |
| `C2`  | Coordinator identifies and invites candidates directly, cohort 1 is outbound    | Cohort Timeline           |
| `C3`  | Prospective lead identifies a fellowship and makes first contact                | Scorecard                 |
| `C4`  | Prospective lead runs the reliability test and records the result               | Scorecard A               |
| `C5`  | Prospective lead completes the fellowship scorecard, including disclosure       | Scorecard B–F             |
| `C6`  | Peer risk: only one live fellowship approach per campus, two-week window        | Charter 11.3              |
| `C7`  | Pair applies: details, track record, video, three written answers, availability | Role & Application 7      |
| `C8`  | Sole applicant applies, conditional route with 60-day clock                     | Outcome Templates 2       |
| `C9`  | Coordinator scores against the seven weighted rubric dimensions                 | Review Rubric             |
| `C10` | Coordinator checks red flags and decision bands                                 | Review Rubric             |
| `C11` | Coordinator interviews the pair together, six dimensions                        | Interview Guide           |
| `C12` | Coordinator issues outcomes as a batch: offer, conditional, decline             | Outcome Templates         |
| `C13` | Cohort onboarding call, attendance is a gate                                    | Onboarding Run Sheet      |
| `C14` | Lead and assistant sign authority and commitment documents                      | Authority, Commitment     |
| `C15` | Materials pack issued                                                           | Onboarding Run Sheet      |
| `C16` | Coordinator works the eight approval gates with evidence per gate               | Approval Checklist        |
| `C17` | Host fellowship signs the open-meeting confirmation                             | Open-Meeting Confirmation |
| `C18` | Founder signs and issues the fellowship letter, gate 8, last                    | Fellowship Letter         |
| `C19` | Chapter created as a department and goes active                                 | Charter 5, 16             |
| `C20` | Lead publishes four term dates in week one                                      | Charter 8                 |
| `C21` | Lead schedules and runs a meeting, 90 or 60 minute format                       | Run Sheet                 |
| `C22` | Lead files a report the same day: five fields, Shift confirmation, flags        | Report Form               |
| `C23` | Coordinator reads flags, same day, before anything else                         | Coordinator Handbook 2.2  |
| `C24` | Student joins a chapter, open entry                                             | Member Pack               |
| `C25` | Member posts a build log: shipped, learned or stuck                             | Build Log                 |
| `C26` | Member moves to observer by job, not by a lead's judgement                      | Member Pack               |
| `C27` | Observer returns to member by posting a build log                               | Member Pack               |
| `C28` | Lead recruits practitioners, at least one below final year                      | Charter 5                 |
| `C29` | Lead escalates: money, press, fellowship, safety, name use, signature           | Authority 4               |
| `C30` | Coordinator acknowledges, resolves, or escalates to founder                     | Coordinator Handbook 1.2  |
| `C31` | Coordinator reads the seven health signals and acts on the intervention ladder  | Coordinator Handbook 3    |
| `C32` | Coordinator runs the termly succession audit                                    | Succession 5              |
| `C33` | Chapter with no assistant for 60 days raises an automatic escalation            | Succession 2              |
| `C34` | Handover: overlap begins, supervised term, transfer term, formal handover       | Succession 3              |
| `C35` | Coordinator produces the termly rollup for the founder                          | Coordinator Handbook 5    |
| `C36` | Chapter moves to at risk, dormant or closed                                     | Charter 5                 |
| `C37` | Lead delivers a Shift session from a versioned pack and reports on it           | Curriculum Arc 6          |
| `C38` | Coordinator revises Shift packs between academic years                          | Curriculum Arc 6          |

### Innovation Showcase

| #     | Journey                                                                    | Source       |
| ----- | -------------------------------------------------------------------------- | ------------ |
| `S1`  | Member submits work: what it does, who for, evidence, what is unfinished   | Showcase 4.1 |
| `S2`  | Campus route: lead forwards to coordinator, coordinator routes to Showcase | Showcase 4   |
| `S3`  | Open route submission during the annual window                             | Showcase 4   |
| `S4`  | Owner assigns a reviewer from the pool, max two a month each               | Showcase 5.4 |
| `S5`  | Reviewer declares any conflict before reading                              | Showcase 5.5 |
| `S6`  | Reviewer scores five dimensions, dimension 4 is a gate                     | Showcase 5.2 |
| `S7`  | Reviewer writes prose review in five parts                                 | Showcase 5.3 |
| `S8`  | Owner reads every review before it goes out, year one                      | Showcase 5.4 |
| `S9`  | Review returned within the published window, 21 days                       | Showcase 5.1 |
| `S10` | Overdue review escalates to coordinator before the student notices         | Showcase 5.1 |
| `S11` | Reviewer nominates for the expo floor                                      | Showcase 6   |
| `S12` | Selection panel decides against five criteria                              | Showcase 6.1 |
| `S13` | Decline issued: specific, and never offering a paid stand                  | Showcase 6.3 |

### Cross-cutting

| #    | Journey                                                                              | Source                       |
| ---- | ------------------------------------------------------------------------------------ | ---------------------------- |
| `X1` | Sign in, sign out, session, password reset                                           | implied                      |
| `X2` | Admin is granted module-based permissions                                            | People Logic 7               |
| `X3` | Photo and media upload, Cloudinary                                                   | People Logic 2, Showcase 4.1 |
| `X4` | Transactional email through Brevo                                                    | P10, P14, P16, C12, S9       |
| `X5` | Audit trail: who confirmed a gate, who changed a status, when                        | governance requirement       |
| `X6` | Scheduled jobs: auto-verify, badges, observer status, overdue reviews, 60-day lapses | P8, P10, C26, C33, S10       |

**73 journeys.**

---

## 4. What depends on what

```
Foundation  ─┬─> People core ─┬─> People public
             │                ├─> People lifecycle & recognition
             │                └─> Campus ─┬─> Campus operations ─> Showcase
             │                            └─> Campus health
             └─> Cross-cutting (email, media, jobs, audit), used by all
```

**The correction that matters:** a chapter is a department and a campus lead is a person record. People core is not a nice-to-have alongside campus, it is underneath it. Campus cannot be built first without inventing a second people model, which is exactly what `AGENTS.md` forbids.

---

## 5. Sprints

Two weeks each, small volunteer team.

| #      | Sprint                                                                          | Journeys                        | Parallel |
| ------ | ------------------------------------------------------------------------------- | ------------------------------- | -------- |
| **1**  | Foundation: RLS, auth, roles, shell, components, four archetypes                | `X1`                            | No       |
| **2**  | People core: departments, person records, assignment. **Reference slice.**      | `P11` `P12` `P6`                | No       |
| **3**  | People public: department pages, team listing, profiles, both apply flows       | `P1` `P2` `P3` `P4` `P15`       | Yes      |
| **4**  | People lifecycle: join app review, pending, auto-verify, override, exit         | `P5` `P7` `P8` `P9` `P13` `P17` | Yes      |
| **5**  | People recognition and comms: badges, birthdays, templates, email plumbing      | `P10` `P14` `P16` `X4` `X6`     | Yes      |
| **6**  | Campus chapters: fellowships, approaches, scorecards, eight gates, open-meeting | `C3`–`C6` `C16`–`C19`           | Yes      |
| **7**  | Campus applications: form, conditional route, rubric, interviews, outcomes      | `C1` `C2` `C7`–`C15`            | Yes      |
| **8**  | Campus operations: terms, meetings, reports, flags, members, build logs         | `C20`–`C29` `C37`               | Yes      |
| **9**  | Showcase: submission, routing, conflicts, review, window, nomination, selection | `S1`–`S13`                      | Yes      |
| **10** | Campus health: signals, succession audit, handover, rollup, escalations         | `C30`–`C36` `C38`               | Yes      |
| **11** | Audit trail, jobs hardening, seed realism, use it for real                      | `X5` `X6`                       | Yes      |

**Twenty-two weeks.** Longer than the sixteen in `DELIVERY_PLAN.md`, because that plan was missing People entirely.

### Why this order

- **Sprint 2 is the reference slice, not campus meetings.** Departments and person records exercise a list, a record, a form, RBAC and RLS, on the lowest-stakes surface in the product. `SLICE_PATTERN.md` comes out of it.
- **Sprints 3 to 5 before campus** because campus leads are people, chapters are departments, and the badge and lifecycle machinery is shared.
- **Sprint 6 before 7** even though applications logically precede chapters. The fellowship scorecard is consumed by the application form, so chapters ships the component that applications imports.
- **Showcase after campus operations** because submissions come from chapter members.
- **Health last** because it reads across everything else.

### The deadline conflict, restated

Cohort 1 opens applications at **T−13 weeks**. Applications is sprint 7, week 14. The platform will not be ready and should not be forced to be.

Run cohort 1 on forms and a spreadsheet. Three chapters is entirely manageable that way, and it is what the eighteen documents were written for. Cohort 1 proves the programme; the platform makes cohort 3 possible.

---

## 6. Open, before we sprint

Things the documents specify inconsistently or not at all. Each needs a decision, not a guess.

Issues 1 to 4 are resolved in `docs/RBAC.md`. Do not re-open them in a feature.

| #   | Issue                                                                                                                                                                                                                       | Status                                                                     |
| --- | --------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- | -------------------------------------------------------------------------- |
| 1   | **Who creates a person record after an application is approved?** Named as an undefined gap in People Logic 8. Blocks `P6`.                                                                                                 | Resolved. The system creates the row at apply. See `RBAC.md` section 4.    |
| 2   | **A campus lead is selected and must run a chapter immediately, but a new person is not publicly visible for 90 days.** Two documents disagree. Does selection auto-verify, or does a lead run a chapter while invisible?   | Resolved. Visibility is not permission. See `RBAC.md` section 2.           |
| 3   | **Do campus students enter the People system at all?** They are community members, not volunteers, and hold no tenure badge. But they need a login to post build logs and submit work. Person record, or something lighter? | Resolved. One `people` table, `kind = community`. See `RBAC.md` section 3. |
| 4   | **Applicants are not people.** Two application types exist, BTE join and campus lead, both from someone with no person record. One pre-person model or two?                                                                 | Resolved. Applicants are people from apply. See `RBAC.md` section 4.       |
| 5   | **Photo is required on every profile and profiles are public.** Consent for public visibility is not captured anywhere.                                                                                                     | Open. Also `RBAC.md` section 13, item 3.                                   |
| 6   | **100-level students may be under 18.** Photos, dates of birth and public profiles for minors is a different legal question, and NDPR applies to all of it.                                                                 | Open. Also `RBAC.md` section 13, items 1 and 2.                            |
| 7   | **`P18` onboarding track and `P19` mentor assignment exist in SOPs with no platform support.** Build, or keep manual?                                                                                                       | Open.                                                                      |
| 8   | **No audit trail is specified anywhere,** yet gate confirmations, status changes and outcome decisions all need one.                                                                                                        | Specified in `RBAC.md` section 11. Not yet built.                          |

Items 5 and 6 are the ones I would not leave to a later sprint.

---

## 7. Next

Access is specified in `docs/RBAC.md`. Remaining open decisions are there in section 13, plus items 5 to 7 above. Do not implement `0002_rbac.sql` until a human asks.
