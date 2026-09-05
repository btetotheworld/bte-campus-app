# BTE Platform

## What this is

This repository is the Believers Tech Expo platform, a Next.js application that runs BTE's internal operations. BTE Campus is a module inside it, not a separate application. Campus chapters are departments. Campus leads are people in the people system. The platform also covers People Management, the Innovation Showcase, and the public-facing surface of all three. See `AGENTS.md` section 1 and `docs/JOURNEYS.md` section 1.

TODO: the brief asked this paragraph to describe BTE Campus as the software for Believers Tech Expo's university arm (student chapters on Nigerian campuses, hosted by partner fellowships), citing `docs/JOURNEYS.md` section 1. That file's section 1 does not say those things. See [Notes that could not be sourced](#notes-that-could-not-be-sourced).

## Why it exists

Cohort 1 can run on forms and a spreadsheet. Three chapters is manageable that way. The platform is what makes later cohorts possible. See `docs/JOURNEYS.md` section 5.

Chapters are run by student leads who will graduate. The documents specify succession, handover, and an automatic escalation when a chapter has no assistant for sixty days, so the chapter can outlast the people who started it. See `docs/JOURNEYS.md` journeys `C32` to `C34` and `C33`, and `docs/DATA_MODEL.md` section 3 (`succession_records`).

TODO: a student's direction in technology is largely set in first year. Not found in the files listed for this README.

TODO: three chapters can be run on a spreadsheet but thirty cannot. `docs/JOURNEYS.md` section 5 says three chapters are manageable on a spreadsheet, and that the platform makes cohort 3 possible. It does not mention thirty.

## What it is not

Not in the platform, for now: partnership and sponsorship management, MOU generation, expo ticketing, floor planning, finance. Those have documents but no journey that needs software this year. See `docs/JOURNEYS.md` section 1.

People Management is in the platform. It is not a separate product and it does not have a separate database. Campus chapters are rows in `departments`. Campus leads are rows in `people`. See `AGENTS.md` section 1, `docs/JOURNEYS.md` section 1, and `docs/DATA_MODEL.md` section 1.

TODO: the brief asked this section to say People Management is a separate product with a separate database and no integration. That claim contradicts the three files above. See [Notes that could not be sourced](#notes-that-could-not-be-sourced).

## The domain

Terms are defined in [`docs/GLOSSARY.md`](docs/GLOSSARY.md). The campus journeys are listed in `docs/JOURNEYS.md` section 3.

A **cohort** is one recruitment cycle. The Program Coordinator opens it and sets a chapter cap. That cap is a growth brake. It reflects interview capacity, not demand. See journey `C1` and `docs/DATA_MODEL.md` (`cohorts.chapters_cap`).

A student pair, a Campus Lead and an Assistant Lead, identify a **host fellowship** at their **institution** and make first contact. They run the **reliability test** (did the fellowship reply, show up, and do what it said) and complete a **fellowship scorecard**. Only one live fellowship approach is allowed per institution at a time. That is **peer risk**. See journeys `C3` to `C6`.

The pair **applies**: details, track record, video, three written answers, availability. A sole applicant can take a conditional route with a sixty-day clock to name an assistant. See journeys `C7` and `C8`.

The coordinator scores the application against a seven-dimension weighted **rubric**, then interviews the pair together on six dimensions. The interview exists to answer whether the assistant is real. Outcomes are issued as a batch: offer, conditional, or decline. See journeys `C9` to `C12`.

An offered pair then clears eight **approval gates**. Gate 8 is the fellowship letter. The founder signs it, and it is always last. A chapter that clears seven gates still does not launch. See journeys `C16` and `C18`, and `docs/DATA_MODEL.md` section 3 (`chapter_approvals`).

When all eight gates are confirmed, the chapter is created as a department and can become **active**. See journey `C19` and the `enforce_gates_before_active` trigger in `db/migrations/0001_init.sql`.

Once active, the lead publishes four meeting dates in week one of a **term**. Each term has four meetings. After each meeting the lead files a **meeting report** the same day: five required fields, a confirmation of **The Shift**, and optional **coordinator flags**. See journeys `C20` to `C23`.

Students join as **members**. They post **build logs** (shipped, learned, or stuck). A scheduled job, not the lead, can move a member to **observer**. An observer returns to member by posting a build log. Only members may submit work for review. See journeys `C24` to `C27`.

**Succession** is how the chapter survives its leaders graduating: overlap, a supervised term, a transfer term, and a formal handover. See journeys `C32` to `C34`.

## Current status

The software is not used for a live cohort. Cohort 1 opens applications at T−13 weeks. Applications is sprint 7. The platform will not be ready for cohort 1 and should not be forced to be. Run cohort 1 on forms and a spreadsheet. Cohort 1 proves the programme. The platform makes cohort 3 possible. See `docs/JOURNEYS.md` section 5.

Sprint order is in that same section. Sprint 1 is foundation: RLS, auth, roles, shell, components, four archetypes. Sprint 2 is People core (the reference slice). Campus slices start at sprint 6. `docs/SLICE_PATTERN.md` does not exist yet. Campus slice briefs in `docs/SLICE_BRIEFS.md` are not issuable until it does.

What is in this repository today, from the files themselves:

- Design tokens in `src/app/globals.css`, derived from `docs/DESIGN_SYSTEM.md`. See `docs/process/SETUP_PROMPTS.md` (phase 2 note).
- Schema and mechanical rules in `db/migrations/0001_init.sql`, checked by `db/tests/0001_invariants.test.sql`.
- Access tables and helpers in `db/migrations/0002_rbac.sql`. Row level security in `db/migrations/0003_rls.sql`.
- Restyled primitives in `src/components/ui/` and BTE compositions in `src/components/bte/`, as listed in `docs/DESIGN_SYSTEM.md` section 8.
- Design register: `D-001` approved. `D-002` to `D-005` draft. See `docs/design/REGISTER.md`.
- Platform shell under `src/app/(platform)/`, with sign-in (`src/lib/actions/auth.ts`). Campus and people routes are placeholders. Home counts stay at zero until those screens read the database.

What is not built: People public and lifecycle, campus applications through health, Innovation Showcase, transactional email, and the scheduled jobs listed in `docs/JOURNEYS.md` section 5, sprints 2 to 11.

TODO: the word "pre-launch" does not appear in `docs/JOURNEYS.md` section 5. The status above is the wording that file does use.

## Quick start

Prerequisites, checked by `scripts/setup.mjs`: Node 20 or later, Docker installed and running, the Supabase CLI (a project devDependency), and `psql`.

```bash
pnpm setup
pnpm dev
```

`pnpm setup` is not a postinstall hook. It is not something `pnpm install` should run silently. In order, `scripts/setup.mjs` does this:

1. Checks Node, Docker, the Supabase CLI, and `psql`.
2. Refuses to continue if the repo is linked to a remote Supabase project.
3. Creates `.env.local` from `.env.example` if `.env.local` is missing.
4. Runs `pnpm install --frozen-lockfile`.
5. Starts the local Supabase stack (`pnpm exec supabase --workdir db start`).
6. Writes the local URL and keys into `.env.local`.
7. Resets the local database (`pnpm db:reset`): migrations and the synthetic seed. Seed data is synthetic. Never clone real rows to a local machine. This system holds student data and some students are minors.
8. Creates local auth users if they are missing (`scripts/seed-local-auth.mjs`).
9. Regenerates `src/lib/db/types.ts` (`pnpm db:types`). Failure here is a warning, not a stop.
10. Runs the invariant tests, and the RBAC and RLS tests if those files exist.
11. Runs typecheck, lint, and tests. Failures here are warnings.

Then `pnpm dev` starts the app. The setup banner prints the local Studio URL (default `http://127.0.0.1:54323`) and the local logins.

The local stack lives in `db/`, not `supabase/`. Every CLI call uses `--workdir db`. Do not leave a machine `supabase link`ed. Link, push, unlink.

Do not commit `.env` or `.env.local`.

### Local sign-in

`pnpm setup` creates these synthetic logins if they do not already exist. `pnpm db:seed-auth` creates any that are missing without resetting the database. Every seed person uses the same password: `local-dev-password`. That password is for the local Docker stack only. Source: `scripts/local-test-users.mjs`.

| Person        | Role                  | Email                          |
| ------------- | --------------------- | ------------------------------ |
| Ada Okafor    | founder               | ada.founder@example.org        |
| Emeka Chukwu  | program coordinator   | emeka.coordinator@example.org  |
| Tobi Adeyemi  | UNILAG campus lead    | tobi.lead@example.org          |
| Ngozi Umeh    | UNILAG assistant lead | ngozi.assistant@example.org    |
| Chidi Eze     | UNILAG practitioner   | chidi.practitioner@example.org |
| Bisi Lawal    | UNILAG member         | bisi.member@example.org        |
| Femi Bello    | UNILAG observer       | femi.observer@example.org      |
| Kunle Afolabi | OAU campus lead       | kunle.lead2@example.org        |
| Grace Nwosu   | OAU assistant lead    | grace.assistant2@example.org   |
| Ibrahim Sule  | OAU member            | ibrahim.member2@example.org    |
| Fatima Bello  | applicant             | fatima.applicant@example.org   |

Start with Ada if you need the whole platform. Use Tobi and Fatima to check chapter-scoped and applicant access.

The app is at [http://localhost:3000](http://localhost:3000). Sign in is at `/sign-in`. The styleguide is at `/styleguide`.

## How the code is organised

Source: `docs/ARCHITECTURE.md`. Application code lives under `src/`, which that file omits.

Vertical slices are owned outright. The shared foundation has one owner and every change to it is reviewed.

A slice owns its route group, its server actions, and components used only by that slice. It does not import another slice's internals. Shared things move to `lib/` or `components/bte/` first, by the foundation owner.

Campus slices, once `docs/SLICE_PATTERN.md` exists: applications, chapters, meetings, members, submissions, health, notifications. People is platform core, not a campus slice.

The foundation owner is the only person who touches `db/` and migrations, `lib/schemas/`, `lib/auth/`, `lib/actions/`, `components/ui/`, the Tailwind config, ESLint config, CI, and anything in `docs/`. A slice that needs a change there raises a request and waits.

Default to Server Components. Mutations are server actions. Every action validates with a Zod schema from `lib/schemas/`. The database enforces access. A hidden button is presentation, not security.

## What is enforced mechanically, not by policy

If a constraint rejects your write, the write is wrong. Do not alter the constraint. See `docs/DATA_MODEL.md` (opening note), `docs/SLICE_BRIEFS.md` (shared rules), and `AGENTS.md` section 3.

### Tailwind defaults are deleted

`src/app/globals.css` sets `--color-*: initial`, `--spacing: initial`, `--radius-*: initial`, and `--text-*: initial`, then declares only the BTE scales. `rounded-lg`, `p-7`, and `text-3xl` are not classes that exist. `eslint.config.mjs` sets `tailwindcss/no-arbitrary-value` to `error`, so `w-[137px]`, `text-[15px]`, and `bg-[#123456]` fail lint.

### Business rules live in the database

The tests in `db/tests/0001_invariants.test.sql` expect these writes to fail, except where noted:

| Test | What it rejects (or allows)                                                         |
| ---- | ----------------------------------------------------------------------------------- |
| 1    | A second live fellowship approach on the same institution (peer risk)               |
| 2    | Setting a chapter to `active` when only seven of eight approval gates are confirmed |
| 3    | Allows `active` once gate 8 is also confirmed                                       |
| 4    | Lead and assistant set to the same person                                           |
| 5    | An observer inserting a submission                                                  |
| 6    | Allows a member to submit, and sets the review window to 21 days                    |
| 7    | A meeting report with `shift_ran = shortened` and no reason                         |
| 8    | A succession record where lead and assistant graduate in the same year              |

### Destructive database commands are blocked unless local

`scripts/guard-local.mjs` runs before `pnpm db:reset`, `pnpm db:seed`, `pnpm db:seed-auth`, and the `pnpm db:test*` scripts. It stops if the repo is linked to a remote Supabase project, if a database URL host is not local, or if `NODE_ENV` / `VERCEL_ENV` / `ENVIRONMENT` is production. `pnpm db:push` prints a warning and exits. Pushing to a remote project is a deliberate human act.

## Documentation map

| Question                                         | File                                                                                                                                                                                                              |
| ------------------------------------------------ | ----------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| What colour, spacing, type, or radius may I use? | `docs/DESIGN_SYSTEM.md`                                                                                                                                                                                           |
| What tables exist, and how do they relate?       | `docs/DATA_MODEL.md`                                                                                                                                                                                              |
| Who can see or write what?                       | `docs/RBAC.md`                                                                                                                                                                                                    |
| How do I change the schema?                      | `AGENTS.md` section 3, `docs/ARCHITECTURE.md` section 4. New file under `db/migrations/`, foundation owner only. Never edit an applied migration. `docs/MIGRATIONS.md` is listed in the brief and does not exist. |
| What am I building, and in what order?           | `docs/JOURNEYS.md`                                                                                                                                                                                                |
| What does a campus slice own?                    | `docs/SLICE_BRIEFS.md` (not issuable until `docs/SLICE_PATTERN.md` exists)                                                                                                                                        |
| What must have a test?                           | `docs/TESTING.md`                                                                                                                                                                                                 |
| What do these domain words mean?                 | `docs/GLOSSARY.md`                                                                                                                                                                                                |
| How do I behave as an agent?                     | `AGENTS.md`                                                                                                                                                                                                       |
| How do I submit a change?                        | `CONTRIBUTING.md`                                                                                                                                                                                                 |

`CLAUDE.md`, `GEMINI.md`, `.clinerules`, `.windsurfrules`, and `.cursor/rules/bte.mdc` are thin pointers to `AGENTS.md`. They carry no rules of their own.

## Working here

Branch from the latest `dev`. Open every pull request against `dev`, never against `main`. `dev` is the integration branch. `main` is production. See `CONTRIBUTING.md`.

`docs/ARCHITECTURE.md` section 6 still says short-lived branches off `main`. Follow `CONTRIBUTING.md`. The two files disagree. See [Notes that could not be sourced](#notes-that-could-not-be-sourced).

One issue, one owner, one branch. Prefixes: `feat/`, `fix/`, `chore/`, `docs/`. Commits use the conventional types the hook already enforces: `feat`, `fix`, `docs`, `chore`, `refactor`, `test`, `ci`.

If the work is visual, it needs a design ref from `docs/design/REGISTER.md`. No ref, no merge.

`.github/CODEOWNERS` requires review on foundation paths (`db/`, schemas, auth, actions, `components/ui/`, `docs/`, `globals.css`, ESLint, `.github/`). The reviewer handle is still `@REPLACE-FOUNDATION-OWNER`. Slice owners in `docs/ARCHITECTURE.md` section 8 are blank.

`.github/workflows/ci.yml` runs on every pull request, and on push to `main`: `pnpm typecheck`, `pnpm lint`, `pnpm check:schema-action-tests`, `pnpm test:coverage`. A second job fails the PR if files change under `db/` without a new file under `db/migrations/`.

Useful scripts from `package.json`:

| Script              | What it does                                      |
| ------------------- | ------------------------------------------------- |
| `pnpm setup`        | Local environment, as above                       |
| `pnpm dev`          | Next.js dev server                                |
| `pnpm typecheck`    | `next typegen` and `tsc --noEmit`                 |
| `pnpm lint`         | ESLint, fail on warnings                          |
| `pnpm test`         | Vitest                                            |
| `pnpm db:reset`     | Wipe and reseed local (guarded)                   |
| `pnpm db:test`      | `0001` invariant tests (guarded)                  |
| `pnpm db:test:rbac` | `0002` tests (guarded)                            |
| `pnpm db:test:rls`  | `0003` tests (guarded)                            |
| `pnpm db:types`     | Regenerate TypeScript types from the local schema |

Merge needs typecheck, lint, and tests green, one human review, screenshots when the UI changed, and the author confirming the definition of done in `AGENTS.md` section 7:

- `pnpm typecheck` passes
- `pnpm lint` passes with no new warnings
- `pnpm test` passes
- No new design token was introduced
- No arbitrary Tailwind value
- Existing components were reused where one fits
- Loading, empty and error states exist
- Keyboard reachable, visible focus state
- Any new table access is covered by an RLS policy
- No em dashes in user-facing copy
- You have read your own diff

Do not write to `main`. Do not commit secrets. Incomplete work merges behind a flag rather than living on a long branch.

## Known open questions

Do not guess these. Each needs a decision. Issues 1 to 4 in `docs/JOURNEYS.md` section 6 are resolved in `docs/RBAC.md`. Do not re-open them in a feature.

From `docs/JOURNEYS.md` section 6 and `docs/RBAC.md` section 13:

- **Minors.** Some 100-level students will be under 18. Accounts, photos, dates of birth, and public profiles are a legal question. NDPR applies. Open. `docs/RBAC.md` section 13, items 1 and 2. `docs/JOURNEYS.md` section 6, item 6.
- **Public profile consent.** Auto-verification can make someone public at 90 days without them agreeing. Capture consent at onboarding, or make listing opt-in. Open. `docs/RBAC.md` section 13, item 3. `docs/JOURNEYS.md` section 6, item 5.
- **Onboarding track and mentor assignment** (`P18`, `P19`) exist in SOPs with no platform support. Open. `docs/JOURNEYS.md` section 6, item 7.
- **Founder as auditor, break-glass, and whether team leads get an admin surface.** Open. `docs/RBAC.md` section 13, items 4 to 6.

From `docs/DATA_MODEL.md` section 6:

- **The Innovation Showcase has no owner.** When it gets one, extend `reviews`. Do not build a parallel structure.

Open decision, not a defect:

- **`departments`, `memberships`, and `badges` are in `db/migrations/0001_init.sql`.** They model the shared people system described in `docs/DATA_MODEL.md` section 1. `docs/JOURNEYS.md` says People Management is not built, and that campus depends on it. `AGENTS.md` forbids a parallel people model. Do not drop these tables to "simplify" campus, and do not invent a second user table beside them. A human decides how the unbuilt People product and these tables meet.

Also still open in `docs/ARCHITECTURE.md` section 8: every owner cell is empty.

## Notes that could not be sourced

These were requested for this README and could not be traced to a file in the repo.

1. **University arm / Nigerian campuses / partner fellowships** as the definition of this software. Cited source was `docs/JOURNEYS.md` section 1. That section lists People Management, BTE Campus, Innovation Showcase, and the public surface. It does not use those phrases. `docs/campus-documents/` contains only a README pointing at Word files that are not in the tree.
2. **A student's direction in technology is largely set in first year.** Not found in `AGENTS.md`, `docs/JOURNEYS.md`, `docs/DATA_MODEL.md`, `docs/DELIVERY_PLAN.md`, or `docs/campus-documents/`.
3. **Thirty chapters cannot be run on a spreadsheet.** `docs/JOURNEYS.md` section 5 discusses three chapters and cohort 3, not thirty.
4. **People Management as a separate product with a separate database and no integration.** Contradicted by `AGENTS.md` section 1, `docs/JOURNEYS.md` section 1, and `docs/DATA_MODEL.md` section 1.
5. **The word "pre-launch".** Not in `docs/JOURNEYS.md` section 5.
6. **`docs/MIGRATIONS.md`.** Listed as a required read. The file does not exist.
7. **`docs/ARCHITECTURE.md` section 6 vs `CONTRIBUTING.md`.** Architecture says branches off `main`. Contributing says branch from `dev` and never open a PR against `main`. This README follows `CONTRIBUTING.md` for how work is submitted.
