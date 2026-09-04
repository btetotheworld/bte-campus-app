> **Reconciliation note (added during file audit):** Phase 2's token-design step and Phase 5's schema-design step are superseded below. The design tokens (`src/app/globals.css`) and the schema (`db/migrations/0001_init.sql`, verified by `db/tests/0001_invariants.test.sql`) are treated as hand-authored inputs to this project, not something an agent should design from the docs on its own. An agent running these phases applies and verifies them; it does not invent them.

# BTE Platform — Setup Prompts

Eight phases. Run them in order, in an empty folder, one at a time. Each ends with a stop condition, because the failure mode of an agent given a large task is that it scaffolds forty files and you cannot tell which ones were thought about.

**Before phase 1:** copy `AGENTS.md` into the folder root and `DESIGN_SYSTEM.md` into `docs/`. Do not ask an AI to write these. They encode brand facts and measured contrast ratios, and a model will drift on both.

After every phase: read the diff. If the agent added something you did not ask for, delete it now rather than after three more phases have built on it.

---

## Phase 1 — Governance

```
This folder contains AGENTS.md and docs/DESIGN_SYSTEM.md. Read both fully before doing anything.

Create the remaining governance files. No application code in this phase.

1. CLAUDE.md, GEMINI.md, .clinerules, .windsurfrules — each a short pointer file whose entire content is an instruction to read AGENTS.md as the authoritative source, plus a warning not to duplicate rules into the pointer file.

2. .cursor/rules/bte.mdc with frontmatter alwaysApply: true, pointing to AGENTS.md and docs/DESIGN_SYSTEM.md.

3. docs/ARCHITECTURE.md — folder structure, the vertical slice model, and slice ownership. Leave owner names blank.

4. docs/DATA_MODEL.md — a stub with section headings only. No tables yet.

5. .gitignore for Next.js, and .env.example with named but empty variables for Supabase, Cloudinary and Brevo.

6. README.md — what this is, how to run it, and where the rules live.

Do not create package.json, do not install anything, do not scaffold Next.js. Stop when these files exist and list them.
```

**Why the pointer files:** every agent looks for a different filename. One canonical file with thin pointers means the rules cannot drift apart. If you paste the rules into all five, they will disagree within a month.

---

## Phase 2 — Scaffold and tokens

```
Scaffold the application.

- Next.js latest, App Router, TypeScript strict, pnpm, ESLint, src directory, Tailwind.
- Archivo and IBM Plex Mono via next/font/google, exposed as CSS variables.
- shadcn/ui initialised in CSS variables mode.

Do not design or encode the design tokens. Use the existing `src/app/globals.css` unchanged. It already carries the authoritative token set derived from `docs/DESIGN_SYSTEM.md` — colours, spacing scale, radius scale, type scale, shadows and font weights. Wire Tailwind and shadcn to read those existing CSS custom properties as-is. Do not edit its values and do not invent additional tokens.

Build a page at /styleguide rendering every token: colour swatches with their measured contrast ratios, the type scale, the spacing scale, the radius scale. This is a working reference, not a marketing page.

Stop there. No features, no database, no auth.
```

**This is the phase that decides whether the rest works.** A design system in a markdown file is advice. A Tailwind config with no `rounded-lg` in it is a constraint — `rounded-lg` stops being a class that exists, and no agent can reach for it.

---

## Phase 3 — Mechanical enforcement

```
Make the design system impossible to violate rather than merely documented.

1. Configure eslint-plugin-tailwindcss with no-arbitrary-value enabled as an error, plus enforces-shorthand and classnames-order.

2. Add an ESLint rule blocking raw hex colours and rgb() in .tsx files.

3. Add an ESLint rule blocking the style prop except where a comment on the line explains why.

4. Add scripts: typecheck (tsc --noEmit), lint, format, test.

5. Vitest with React Testing Library. One real test so the harness is proven.

6. GitHub Actions running typecheck, lint and test on every pull request. Fail on warnings.

7. A CI step that fails if any file under db/ changed without a corresponding new file in db/migrations/.

8. Husky pre-commit running lint-staged.

Verify by writing a component that uses w-[137px] and bg-[#ff0000], confirming CI rejects it, then deleting it.

Stop there.
```

That verification step at the end matters. Guardrails nobody has watched fail are guardrails nobody knows are switched on.

---

## Phase 4 — Components

```
Build the component layer.

Add these shadcn primitives to components/ui/: button, input, label, textarea, select, checkbox, radio-group, dialog, dropdown-menu, table, badge, card, tabs, toast, skeleton, separator, tooltip, popover, alert.

Restyle each to docs/DESIGN_SYSTEM.md. In particular: 4px radius everywhere, correct button heights (32/36/40), navy focus rings, and no shadows on cards.

Then build these in components/bte/, composed from the primitives:

- PageHeader — title, optional description, optional action slot
- DataTable — navy header, mono uppercase labels, 44px rows, zebra striping, sortable
- EmptyState — one line and one action, no illustration
- StatusBadge — neutral by default, semantic only when meaningful
- FormField — label above input, help text, error message
- MetaLabel — the mono uppercase label used throughout
- GateChecklist — a checklist row with state, for approval gates

Every component implements default, hover, focus, active, disabled and loading. Add each to /styleguide with all states visible.

Do not build any feature screens. Stop here.
```

Six engineers each solving "how do I show a table" produces six tables. Build them once, and the slice work becomes composition.

---

## Phase 5 — Data foundation

```
Set up Supabase.

1. Supabase CLI, local development, migrations in db/migrations/.

2. Do not design the schema. Apply `db/migrations/0001_init.sql` as-is — it already contains the authoritative schema for the platform core and the full campus module, derived from `docs/DATA_MODEL.md`.

3. Verify with `db/tests/0001_invariants.test.sql`. Every invariant in that file must pass before continuing. Do not weaken a constraint to make a test pass — if one fails, stop and say so.

4. Row level security on every table, with no exceptions. Write the policies from the BTE Campus documents: a campus lead sees their own chapter, the coordinator sees all chapters, a member sees their own submissions.

5. Auth with role-based access. Roles: founder, coordinator, campus_lead, assistant_lead, practitioner, member.

6. Generated TypeScript types committed to the repo, with a script to regenerate.

7. A seed script with one cohort, two chapters, and enough people to exercise every role.

`docs/DATA_MODEL.md` already documents every table. Do not regenerate or rewrite it.

Do not build UI. Stop when migrations run clean, invariants pass, and the seed loads.
```

**One person owns this phase and nobody else touches `db/` afterwards without review.** Six agents each adding a slightly different `students` table is the single most expensive thing that can happen to this repo.

---

## Phase 6 — Contracts

```
Create lib/schemas/ containing one Zod schema per entity, derived from the generated database types.

Each schema exports: the full entity, an insert variant, an update variant, and inferred TypeScript types.

Encode the business rules from the BTE Campus documents as refinements, so they are enforced at the boundary rather than in six different components:

- A campus lead has at least one full academic year remaining; an assistant lead has at least two.
- Lead and assistant are in different year groups.
- A meeting report requires all five fields.
- A chapter cannot reach approved status until all eight gates are recorded.
- A fellowship scorecard with a FAIL reliability result cannot be recommended.

Add lib/auth/ with role checking helpers, and lib/actions/ with a wrapper that every server action uses: authenticate, authorise, validate, execute, return a typed result.

Stop there.
```

This is what stops agents inventing plausible rules. When eligibility lives in one refinement, it cannot be six subtly different implementations.

---

## Phase 7 — The reference slice

```
Build ONE feature end to end, to the standard every other slice will be held to: meetings and reports.

- List meetings for a chapter
- Schedule a meeting
- File a meeting report — the five fields, plus the coordinator flags box, plus the Shift confirmation
- Coordinator view of reports across all chapters, with unread flags surfaced first

Use only existing components. Use the server action wrapper. Use the Zod schemas. Server Components by default.

Implement loading, empty and error states for every view.

Write tests for the server actions and the validation rules.

Then write docs/SLICE_PATTERN.md documenting the pattern you followed, so the other five slices copy it rather than inventing their own.

This slice is the reference implementation. Take longer over it than feels necessary.
```

Do not parallelise before this exists. Five engineers building against a written pattern converge; five engineers building against a blank folder do not.

---

## Phase 8 — Parallel work

Only now do you hand out slices. Each engineer gets:

```
Build the [SLICE] feature.

Read AGENTS.md, docs/DESIGN_SYSTEM.md, docs/ARCHITECTURE.md, docs/DATA_MODEL.md and docs/SLICE_PATTERN.md first.

Follow the pattern in app/(platform)/campus/meetings/ exactly. Use existing components and existing Zod schemas.

You own app/(platform)/campus/[SLICE]/ and nothing outside it. If you need a change to lib/, components/ or db/, raise it rather than making it.

Work on a branch. Open a PR. Confirm the definition of done in AGENTS.md before requesting review.
```

Slices: `applications` · `chapters` · `members` · `submissions` · `health` · `notifications`

---

## Keeping it working

**Re-anchor after a long session.** Agents drift as context fills. "Re-read AGENTS.md and docs/DESIGN_SYSTEM.md, then check your last three files against the definition of done" recovers most of it.

**When output looks generic**, name the specific violation rather than asking for improvement. "This uses rounded-lg and a card shadow, both of which the design system forbids" produces a fix. "Make it look better" produces a gradient.

**When the same correction recurs, the rules file is wrong, not the agent.** Add the rule and the correction stops repeating.

**Reject any PR that changes the Tailwind config, ESLint config or a migration** unless that was the point of the PR. This is the most common way an agent makes a failing build pass, and it is silent.

**Review for intent, not syntax.** CI reads every line for correctness. Humans read for whether it does the right thing. AI code that compiles and follows local convention while solving the wrong problem is the failure mode that gets through.
