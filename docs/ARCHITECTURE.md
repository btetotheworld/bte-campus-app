# ARCHITECTURE.md

How this repository is organised, and who may change what.

---

## 1. Principle

Six engineers with AI assistants generate code faster than six engineers without them, and they generate divergent code faster too. The structure below exists so that speed compounds instead of colliding.

**Vertical slices are owned outright. The shared foundation has one owner and every change to it is reviewed.** That asymmetry is the whole design. Within a slice, move fast. Outside it, ask.

---

## 2. Layout

```
app/
  (auth)/                       sign in, callback
  (platform)/
    layout.tsx                  shell, nav, role gate
    campus/
      applications/             SLICE
      chapters/                 SLICE
      meetings/                 SLICE  (reference implementation)
      members/                  SLICE
      submissions/              SLICE
      health/                   SLICE
    people/                     platform core
    styleguide/                 token and component reference

components/
  ui/                           shadcn primitives. do not fork.
  bte/                          BTE compositions built from ui/

lib/
  schemas/                      Zod, one per entity. business rules live here.
  actions/                      server action wrapper
  auth/                         role checks
  db/                           client, generated types
  utils/

db/
  migrations/                   one owner
  seed/

docs/
  AGENTS.md is at the repo root
  DESIGN_SYSTEM.md
  DATA_MODEL.md
  ARCHITECTURE.md
  SLICE_PATTERN.md
```

---

## 3. Slices

A slice owns its route group, its server actions, its slice-local components, and nothing else.

| Slice           | Covers                                                   |
| --------------- | -------------------------------------------------------- |
| `applications`  | Application form, rubric scoring, interviews, outcomes   |
| `chapters`      | Approval gates, fellowships, scorecards, chapter records |
| `meetings`      | Scheduling, meeting reports, coordinator flags           |
| `members`       | Roster, observer status, build logs                      |
| `submissions`   | Student work, review queue, turnaround windows           |
| `health`        | Succession audit, at-risk signals, termly rollups        |
| `notifications` | Brevo, reminders, outcome letters, review-window alerts  |

**Test for a good slice:** one person can build it, see it on a preview URL, and merge it without waiting for anyone. If a proposed feature fails that test, it is not a slice — it is foundation work wearing a feature's clothes.

### Rules

- A slice never imports from another slice's internals. Shared things move to `lib/` or `components/bte/` first, by the foundation owner.
- A slice never edits `db/`, `lib/schemas/`, `components/ui/`, the Tailwind config, ESLint config or CI. It raises a request.
- Two slices needing the same component means it belongs in `components/bte/`, not copied into both.

---

## 4. Foundation

Single owner. Changes reviewed regardless of size.

`db/` and migrations · `lib/schemas/` · `lib/auth/` · `lib/actions/` · `components/ui/` · Tailwind config · ESLint config · CI · anything in `docs/`

The failure this prevents: six agents each adding a slightly different `students` table, or six subtly different implementations of the eligibility rule. Both are cheap to prevent and very expensive to unpick.

---

## 5. Data flow

```
Server Component
    ↓ reads through lib/db, constrained by RLS
Render
    ↓ user acts
Server Action
    ↓ authenticate → authorise → validate (Zod) → execute → typed result
Database
    ↓ RLS policy is the real boundary
revalidatePath
```

- Server Components by default. `"use client"` only for state, effects or browser APIs, pushed as far down as possible.
- Every mutation is a server action using the wrapper in `lib/actions/`.
- Every action validates with a schema from `lib/schemas/`.
- The database enforces access. A hidden button is presentation, not security.

---

## 6. Branching

Short-lived branches off `main`. One slice per branch. Preview deploy per pull request.

Merge requires: typecheck, lint, tests green, one human review, and the definition of done in `AGENTS.md` confirmed by the author.

Incomplete work merges behind a flag rather than living on a long-running branch. Long branches diverge, and AI-assisted branches diverge faster.

---

## 7. Order of work

Phases 1 to 7 of the setup prompts run sequentially, by one person. Only after `docs/SLICE_PATTERN.md` exists does parallel work begin.

Five engineers building against a written pattern converge. Five building against a blank folder produce five architectures, and reconciling them costs more than the parallelism saved.

---

## 8. Ownership

Fill in and keep current. An unowned slice is an unmaintained slice.

| Area            | Owner |
| --------------- | ----- |
| Foundation      |       |
| `applications`  |       |
| `chapters`      |       |
| `meetings`      |       |
| `members`       |       |
| `submissions`   |       |
| `health`        |       |
| `notifications` |       |
