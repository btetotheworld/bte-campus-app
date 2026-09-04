# DELIVERY_PLAN.md

How the BTE platform gets built: what gets designed, in what order, who builds what, and the mechanism that keeps implementation on-design.

Sprint order and feature breakdown live in `docs/JOURNEYS.md`. Sections 4 and 5 below covered the campus module only, treated People Management as already built, and are superseded.

---

## 1. Design once, compose many

The instinct is to design each slice as a set of screens. Do not. Twenty-five screens designed individually produce twenty-five slightly different interpretations, and no dev can hold them all in their head.

Almost every screen in this product is one of four shapes:

| Archetype     | Examples                                                                       |
| ------------- | ------------------------------------------------------------------------------ |
| **List**      | Meetings in a term, applications in a cohort, chapter roster, submission queue |
| **Record**    | Chapter detail, application detail, member detail                              |
| **Form**      | File a report, submit work, score an application, fill a scorecard             |
| **Dashboard** | Chapter health, coordinator overview, termly rollup                            |

Design those four properly, plus the component vocabulary underneath them, and every remaining screen becomes composition. A dev building the roster is not interpreting a design, they are applying the list pattern with the member row component.

**This is also the enforcement mechanism.** A dev composing from existing components cannot drift far. A dev handed a screenshot and told to match it will drift on every screen, and no amount of documentation prevents it.

### Design order

1. **Component vocabulary.** Extract from the meetings design already in progress. Goes into `src/components/bte/`.
2. **The four archetypes.** One canonical example of each.
3. **Feature screens.** Only where a feature genuinely departs from an archetype. Most will not.

Steps 1 and 2 are roughly a week of design work and unlock everything. Step 3 is small and ongoing.

---

## 2. The design register

Designs live in Claude Design, which shares as internal URLs. That is fine until someone asks "which design is the roster built from" and nobody knows.

Keep `docs/design/REGISTER.md` in the repo:

| Ref     | What                 | Status | Link | Built in |
| ------- | -------------------- | ------ | ---- | -------- |
| `D-001` | Component vocabulary |        |      |          |
| `D-002` | List archetype       |        |      |          |
| `D-003` | Record archetype     |        |      |          |
| `D-004` | Form archetype       |        |      |          |
| `D-005` | Dashboard archetype  |        |      |          |
| `D-010` | Meeting report form  |        |      | `M2`     |

Rules:

- Every design gets a ref before it gets built.
- A PR implementing a design names the ref in its description. No ref, no merge.
- When a design changes, the ref stays and the version increments. Never silently replace.
- Status is one of: `draft`, `approved`, `built`, `superseded`.

Approval is the founder's, not a dev's. Designs are cheap to argue about and expensive to rebuild.

---

## 3. Keeping devs on-design

Four layers, weakest to strongest. The strongest ones are already in place.

**Layer 1. Documentation.** `DESIGN_SYSTEM.md`. Advisory. Useful for reasoning, useless as a guarantee.

**Layer 2. Configuration.** `globals.css` deletes Tailwind's default scales; ESLint rejects arbitrary values. A dev cannot use a colour, spacing, radius or type size that is not BTE's. Already working.

**Layer 3. Components.** The real one. If `DataTable` exists and is correct, every table in the product is correct. Drift becomes a component PR, which gets reviewed, rather than a screen decision nobody sees. This is why the component vocabulary is designed first.

**Layer 4. Review.** A screenshot in every PR that touches UI, next to the design ref. Reviewers compare two images, which takes seconds and catches what the other three layers cannot: wrong layout built from correct components.

Note what layer 2 does not catch: ``className={`p-${n}`}`` produces no CSS and no error. Class names are always complete literal strings. This belongs in `AGENTS.md`.

---

## 4. Features

Superseded by `docs/JOURNEYS.md`. Kept here so the design-ref mapping is not lost. Do not schedule work from this table.

A feature is one PR-sized unit, two to four days. Each names its slice, its design ref, and its dependencies.

### Foundation: no slice, one owner

| #    | Feature                                          | Depends on |
| ---- | ------------------------------------------------ | ---------- |
| `F1` | RLS policies, `0002_rls.sql`, tested like `0001` | schema     |
| `F2` | Auth, roles, platform shell, nav                 | F1         |
| `F3` | BTE component set from `D-001`                   | design     |
| `F4` | The four archetype pages in `/styleguide`        | F3         |

### Meetings: the reference slice

| #    | Feature                                         | Design  |
| ---- | ----------------------------------------------- | ------- |
| `M1` | Terms and meeting scheduling                    | `D-002` |
| `M2` | File a report, five fields plus Shift and flags | `D-010` |
| `M3` | Coordinator report inbox, unread flags first    | `D-002` |

Ends with `docs/SLICE_PATTERN.md`. Everything after copies it.

### Applications

| #    | Feature                                  | Design  |
| ---- | ---------------------------------------- | ------- |
| `A1` | Application form, multi-step, draft save | `D-004` |
| `A2` | Review queue and rubric scoring          | `D-002` |
| `A3` | Interview scheduling and scorecard       | `D-004` |
| `A4` | Outcome issuing, batched                 | `D-003` |

### Chapters

| #    | Feature                                   | Design  |
| ---- | ----------------------------------------- | ------- |
| `C1` | Fellowship directory and approach tracker | `D-002` |
| `C2` | Fellowship scorecard form and review      | `D-004` |
| `C3` | Eight-gate approval checklist             | `D-003` |
| `C4` | Chapter record and status                 | `D-003` |

`C2` is consumed by `A1`. Build it before or alongside, not after.

### Members

| #     | Feature                    | Design           |
| ----- | -------------------------- | ---------------- |
| `ME1` | Roster and member detail   | `D-002`, `D-003` |
| `ME2` | Build log feed and posting | `D-002`          |
| `ME3` | Observer status job        | none             |

### Submissions

| #    | Feature                           | Design           |
| ---- | --------------------------------- | ---------------- |
| `S1` | Submit work                       | `D-004`          |
| `S2` | Chapter submission list           | `D-002`          |
| `S3` | Review queue and writing a review | `D-002`, `D-004` |

### Health

| #    | Feature                  | Design  |
| ---- | ------------------------ | ------- |
| `H1` | Chapter health dashboard | `D-005` |
| `H2` | Succession audit         | `D-003` |
| `H3` | Termly rollup            | `D-005` |

### Notifications

| #    | Feature                              | Design  |
| ---- | ------------------------------------ | ------- |
| `N1` | Brevo integration and templates      | `D-003` |
| `N2` | Meeting and report reminders         | none    |
| `N3` | Review-window alerts and escalations | none    |

---

## 5. Sprints

Superseded by `docs/JOURNEYS.md` section 5. That plan is eleven sprints and twenty-two weeks, because People core is underneath campus, not beside it.

| Sprint | Content                                  | Parallel?                                   |
| ------ | ---------------------------------------- | ------------------------------------------- |
| **1**  | `F1` `F2` `F3` `F4`                      | No. One owner. Everything depends on this.  |
| **2**  | `M1` `M2` `M3` + `SLICE_PATTERN.md`      | No. One dev builds, others review and read. |
| **3**  | `A1` `A2` · `C1` `C2`                    | Yes. Parallel work starts here.             |
| **4**  | `A3` `A4` · `C3` `C4`                    | Yes                                         |
| **5**  | `ME1` `ME2` `ME3` · `S1` `S2`            | Yes                                         |
| **6**  | `S3` · `H1` `H2`                         | Yes                                         |
| **7**  | `N1` `N2` `N3` · `H3`                    | Yes                                         |
| **8**  | Hardening, seed realism, use it for real | Yes                                         |

Sixteen weeks.

**Sprints 1 and 2 are deliberately not parallel.** Five people building against a blank folder produce five architectures. One person builds the pattern, everyone else reads it, then parallel work is safe. Resisting the urge to parallelise early is the highest-leverage decision in this plan.

---

## 6. The deadline that actually matters

The build order and the cohort calendar disagree, and this needs a decision rather than a discovery.

The cohort timeline opens applications at **T−13 weeks** before the first chapter meeting. Applications is sprint 3 to 4, which is **weeks 5 to 8** of the build. Meetings, the first thing built, is not needed live until **T−0**.

Two options, and only one of them is honest:

**Do not block cohort 1 on the software.** Run applications on a form and a spreadsheet, and the first term's reports the same way. Three chapters is entirely manageable that way, and it is what the documents were written for. The platform catches up.

The alternative, reordering the build so applications ships first, means learning the pattern on the highest-stakes, deadline-driven slice. Do not do that. Meetings is small, self-contained and low consequence, which is exactly what a reference implementation should be.

Cohort 1 proves the programme. The platform makes cohort 3 possible.

---

## 7. Definition of ready

A feature is not started until:

- Its design ref exists and is `approved`, or it genuinely needs no design.
- Its rules are already in `lib/schemas/`, not to be written inside the feature.
- Its tables exist. No feature ships a migration.
- Its owner is named.
- It fits in one PR. If not, split it.

## Definition of done

`AGENTS.md` section 7, plus:

- Screenshot in the PR, next to the design ref.
- Tests for any schema or server action, per `docs/TESTING.md`.
- Loading, empty and error states exist.
- Register updated: status `built`, feature ref recorded.

---

## 8. Roles

| Role     | Owns                                                    |
| -------- | ------------------------------------------------------- |
| Founder  | Design approval, foundation, `docs/`, CODEOWNERS review |
| Devs     | One slice each from sprint 3 onward                     |
| Reviewer | Every PR gets one. Rotate. Read for intent, not syntax. |

**Nobody owns two slices in the same sprint.** A person spread across two slices reviews neither properly and context-switches through both.

---

## 9. What goes wrong

Named here so it is recognised rather than explained afterwards.

| Failure                            | Looks like                                         | Response                                         |
| ---------------------------------- | -------------------------------------------------- | ------------------------------------------------ |
| Parallelising before sprint 2 ends | "We can start chapters while meetings finishes"    | No. The pattern does not exist yet.              |
| Building without a design ref      | A screen appears that nobody designed              | Reject the PR. Cheaper than rebuilding.          |
| A dev edits the foundation         | Tailwind config or a migration in a slice PR       | CODEOWNERS blocks it. Do not approve.            |
| Component drift                    | A second table implementation appears              | It belongs in `components/bte/`. Move it.        |
| Designing every screen             | Twenty-five design refs                            | Four archetypes plus components. Stop designing. |
| Blocking the cohort on software    | "We can't open applications, the form isn't built" | A spreadsheet is fine. Ship the cohort.          |
