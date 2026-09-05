# BTE Platform

The Believers Tech Expo platform. A Next.js application that runs BTE's internal operations. BTE Campus, chapter recruitment, approval, meetings, membership, submissions and health monitoring, is a module inside this platform, not a separate application.

## How to run it

```bash
pnpm install
cp .env.example .env.local
pnpm setup
pnpm dev
```

`pnpm setup` is not a postinstall hook. It starts local Docker, applies migrations, and loads the synthetic seed. Never dump remote rows onto a laptop. Some students are minors.

The app is at [http://localhost:3000](http://localhost:3000). Home is the platform shell. Sign in is at `/sign-in`. The styleguide is at `/styleguide`.

```bash
pnpm typecheck
pnpm lint
pnpm test
pnpm db:test
```

`pnpm db:reset`, `pnpm db:seed`, and `pnpm db:test` are guarded. They refuse to run if this repo is linked to a remote Supabase project, if a database URL is not localhost, or if `NODE_ENV` is production. `pnpm db:push` prints a warning and exits. Pushing to remote is a deliberate human act.

After `pnpm setup`, put the local anon key from `pnpm exec supabase --workdir db status` into `.env.local`. Do not commit `.env` or `.env.local`.

## How to contribute

Read [CONTRIBUTING.md](CONTRIBUTING.md). Branch from `dev`. Open every pull request against `dev`, never against `main`. Link the issue, attach screenshots for UI changes, and include the preview URL.

## Where the rules live

`AGENTS.md`, at the repo root, is the single source of truth for how any AI coding agent works in this repository. `CLAUDE.md`, `GEMINI.md`, `.clinerules`, `.windsurfrules` and `.cursor/rules/bte.mdc` are thin pointers to it. They carry no rules of their own, and none of them should ever grow any.

## Authoritative documents

These files are specifications, not working notes. Do not rewrite, regenerate, reformat or "improve" them without explicit instruction in the current conversation:

- `AGENTS.md` - how any AI agent works in this repo.
- `docs/DESIGN_SYSTEM.md` - authoritative for anything visual.
- `docs/DATA_MODEL.md` - authoritative schema, derived from the BTE Campus document set.
- `docs/ARCHITECTURE.md` - folder structure and slice ownership.
- `docs/SLICE_BRIEFS.md` - per-engineer briefs, issuable only once `docs/SLICE_PATTERN.md` exists.
- `docs/process/SETUP_PROMPTS.md` - the phased setup prompts used to build this repo out.
- `src/app/globals.css` - the encoded design tokens.
- `db/migrations/0001_init.sql` and `db/tests/0001_invariants.test.sql` - the schema and its invariant tests.

## Source documents

The BTE Campus charter, approval checklist, succession policy, meeting report form, onboarding pack and related governance documents live in the folders at the repo root (`Governance/`, `Member-facing/`, `Program Coordinator Handbook/`, `Recruitment & selection/`, and the charter file itself at the root). `docs/DATA_MODEL.md` and `docs/SLICE_BRIEFS.md` are derived from these. Where the two disagree, resolve it with a human rather than guessing.
