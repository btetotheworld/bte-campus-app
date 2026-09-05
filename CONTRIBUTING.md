# Contributing

How work gets onto this repository. `AGENTS.md` is still the rulebook for how the code is written. This file is how you submit that code for review.

## The rule that matters

**Open every pull request against `dev`. Never against `main`.**

`dev` is the integration branch. `main` is production. A slice PR that targets `main` will be closed and reopened against `dev`.

Promoting `dev` to `main` is a foundation-owner action. It is not part of finishing a slice.

## Before you start

1. Read `AGENTS.md`. If you are using an AI assistant, it must read that file first.
2. Pick up one GitHub issue. One issue, one owner, one branch.
3. If the work is visual, it needs a design ref from `docs/design/REGISTER.md`. No ref, no merge.
4. Branch from the latest `dev`, not from `main` and not from someone else's slice.

```bash
git fetch origin
git checkout dev
git pull
git checkout -b feat/short-name-of-the-issue
```

Use `feat/`, `fix/`, `chore/`, or `docs/` as the prefix. Name the branch after the issue, not after a guess at the architecture.

## While you work

- Keep the branch short-lived. One slice, or one foundation change.
- Do not add a dependency, change auth, or edit schema unless the issue says so and a human has asked in that conversation.
- Do not commit `.env`, `.env.local`, keys, or a dump of remote rows. Seed data is synthetic. Some students are minors.
- Do not leave your machine `supabase link`ed. Link, push, unlink.
- Follow the definition of done in `AGENTS.md` section 7 before you open the PR. Typecheck, lint, and tests are not optional. Empty and error states are not a later pass.

Commits use the conventional types the hook already enforces: `feat`, `fix`, `docs`, `chore`, `refactor`, `test`, `ci`. Write the subject as a sentence about why, not a file list.

## Opening the pull request

Target **`dev`**.

The PR body must include:

1. **The issue.** A link, not just a number in the title. Example: `https://github.com/btetotheworld/bte-campus-app/issues/11`.
2. **The design ref**, if anything visual changed. Example: `D-002`.
3. **A summary** of what a reviewer should believe is now true. Three bullets is enough.
4. **Screenshots** for any user-facing change. Desktop, and mobile if the layout changes. Show the empty state as well as the happy path. A single render of the default screen is not enough.
5. **The preview URL** once Vercel has one.
6. **A test plan** the reviewer can click through. Tick boxes, not prose.

Use this shape:

```md
## Summary

- …

## Issue

https://github.com/btetotheworld/bte-campus-app/issues/N

## Design ref

`D-00N` (or "none, no visual change")

## Screenshots

| State     | Desktop | Mobile |
| --------- | ------- | ------ |
| Populated |         |        |
| Empty     |         |        |
| Error     |         |        |

## Preview

https://…

## Test plan

- [ ] …
```

Do not use "Closes #N" unless the issue is actually finished. If auth is half-wired, say so and leave the issue open.

## Review

Merge needs:

- Typecheck, lint, and tests green on the PR
- One human review
- The author confirming `AGENTS.md` section 7
- Screenshots, when the UI changed

Reviewers: read the diff as if someone else wrote it. Code that compiles and follows the local pattern can still do the wrong thing.

Incomplete work merges behind a flag. It does not live on a long-lived branch.

## After merge

Delete the branch. Pull `dev`. Do not keep working on a branch that has already merged.

If you need a follow-up, open a new issue and a new branch from `dev`.
