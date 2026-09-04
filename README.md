# BTE Platform

The Believers Tech Expo platform. A Next.js application that runs BTE's internal operations. BTE Campus - chapter recruitment, approval, meetings, membership, submissions and health monitoring - is a module inside this platform, not a separate application.

## Status

Nothing has been scaffolded yet. This repository currently holds the specification and governance files only: no `package.json`, no Next.js app, no database. Setup runs in the phases documented in `docs/process/SETUP_PROMPTS.md`.

## How to run it

There is nothing to run yet. Once Phase 2 of `docs/process/SETUP_PROMPTS.md` has scaffolded the Next.js app, this section should be replaced with real install and dev-server instructions (`pnpm install`, `pnpm dev`, and so on).

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
- `src/app/globals.css` - the encoded design tokens, once it exists in this repo.
- `db/migrations/0001_init.sql` and `db/tests/0001_invariants.test.sql` - the schema and its invariant tests, once they exist in this repo.

## Source documents

The BTE Campus charter, approval checklist, succession policy, meeting report form, onboarding pack and related governance documents live in the folders at the repo root (`Governance/`, `Member-facing/`, `Program Coordinator Handbook/`, `Recruitment & selection/`, and the charter file itself at the root). `docs/DATA_MODEL.md` and `docs/SLICE_BRIEFS.md` are derived from these. Where the two disagree, resolve it with a human rather than guessing.
