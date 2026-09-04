# AGENTS.md

Canonical instructions for any AI coding agent working in this repository.

This file is the single source of truth. `CLAUDE.md`, `GEMINI.md`, `.cursor/rules/`, `.windsurfrules` and `.clinerules` all point here. If you are an agent and you are reading one of those files instead, stop and read this one.

---

## 1. What this is

The Believers Tech Expo platform. A Next.js application that runs BTE's internal operations.

**BTE Campus is a module inside this platform, not a separate application.** Campus chapters are departments. Campus leads are people in the people system. Do not create a parallel user table, a parallel role system, or a parallel organisation model. If you find yourself about to, stop and ask.

The behaviour this software implements is specified in the BTE Campus document set (charter, approval checklist, succession policy, and so on). Where a rule appears in those documents, the software enforces it — it does not reimplement it differently.

---

## 2. Before you write anything

Read, in this order:

1. This file.
2. `docs/DESIGN_SYSTEM.md` — authoritative for anything visual.
3. `docs/ARCHITECTURE.md` — folder structure and slice boundaries.
4. `docs/DATA_MODEL.md` — tables, relationships, access rules.
5. The existing components in `components/ui/` and `components/bte/`.

Then search the codebase for an existing solution before creating a new one. Duplicated components are the primary failure mode of AI-assisted work on this repo.

---

## 3. Hard stops

Do not do any of these without explicit human instruction in the current conversation. If a task appears to require one, stop and say so.

- **Create or alter a database table, column, index or RLS policy.** Schema changes go through one owner and one migration file. Never edit schema through a dashboard.
- **Add a dependency.** Propose it, state what it replaces, wait.
- **Change authentication, session handling, or role definitions.**
- **Change anything in `docs/`.** These are specifications, not working notes.
- **Modify CI configuration, lint rules, or the Tailwind config** to make your code pass. If the tooling rejects your code, the code is wrong.
- **Introduce a design token.** Colours, spacing values, font sizes, radii, shadows and animation durations are fixed. See `docs/DESIGN_SYSTEM.md`.
- **Write to `main`.** Branch, open a PR, let the preview deploy build.
- **Delete or rewrite tests to make them pass.**
- **Commit secrets, keys, or a `.env` file.**

---

## 4. Architecture rules

**Vertical slices.** Each feature owns its route group, its server actions, and its components. Cross-slice imports go through `lib/` or `components/`, never directly into another slice's internals.

```
app/(platform)/campus/
  applications/     one owner
  chapters/         one owner
  meetings/         one owner
  members/          one owner
  submissions/      one owner
  health/           one owner
lib/                shared. changes reviewed.
components/ui/      shadcn primitives. do not fork.
components/bte/     BTE compositions built from ui/.
db/migrations/      one owner.
```

**Server first.** Default to Server Components. Reach for `"use client"` only when you need state, effects or browser APIs, and push it as far down the tree as possible.

**Mutations are server actions.** Every one validates its input with the Zod schema from `lib/schemas/`. No unvalidated writes.

**The database enforces access, not the UI.** Every table has row level security. Hiding a button is presentation, not security. If a rule matters, it is a policy.

**Types come from the schema.** Run the type generator; import the generated types. Do not hand-write a type that describes a table.

---

## 5. Writing code here

- TypeScript strict. No `any`. No `@ts-ignore` without a comment explaining why.
- Class names are always complete literal strings, never constructed from variables. A dynamic class produces no CSS and no error.
- Name things the way the BTE documents name them. A chapter is a chapter, a lead is a lead, an assistant lead is an assistant lead, a build log is a build log. Do not invent synonyms.
- Errors are handled and surfaced to the user. No silent `catch {}`.
- Loading and empty states are part of the feature, not a later pass. A list with no empty state is not finished.
- Dates are stored UTC and rendered in West Africa Time.
- No `console.log` in committed code.

---

## 6. Content rules

Anything a human reads — labels, empty states, errors, emails — follows BTE house style:

- Full sentences. Sentence case for headings and buttons, never Title Case.
- **No em dashes anywhere.** Use a comma, a full stop, or a rewrite.
- Plain and direct. "This chapter has no meetings yet" beats "No data available."
- Errors say what happened and what to do next.
- Never invent a promise the platform does not keep. In particular, nothing in this product mentions investors, publication, ranking or badges for student work unless a human has told you that feature now exists.

---

## 7. Definition of done

Before you say a task is complete, verify each of these yourself. Do not report completion until they pass.

- [ ] `pnpm typecheck` passes.
- [ ] `pnpm lint` passes with no new warnings.
- [ ] `pnpm test` passes.
- [ ] No new design token was introduced.
- [ ] No arbitrary Tailwind value (`w-[137px]`, `text-[15px]`, `bg-[#123456]`).
- [ ] Existing components were reused where one fits.
- [ ] Loading, empty and error states exist.
- [ ] Keyboard reachable, visible focus state.
- [ ] Any new table access is covered by an RLS policy.
- [ ] No em dashes in user-facing copy.
- [ ] You have read your own diff.

That last one is not a formality. Read the diff as though someone else wrote it.

---

## 8. When you are unsure

Say so. State the two options and what you would pick.

Do not guess at a business rule. The BTE Campus documents are specific about gates, eligibility, tenure, escalation and succession, and inventing a plausible-sounding variant is worse than asking. A wrong rule that looks right will survive review.

Do not pad an unfinished feature with placeholder data that looks real. Mark it clearly or leave it out.

---

## 9. Reviewing your own output

AI-generated code on this repo fails in a specific way: it compiles, it follows the local pattern, and it does the wrong thing. Type checking will not catch that. Before finishing, ask whether the code does what was asked, or what a plausible adjacent request would have asked for.
