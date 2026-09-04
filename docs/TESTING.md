# Testing

We are not chasing a coverage number. A test exists because a wrong result would be expensive, not because a percentage looked low.

## What must have tests

**Must.** Everything in `lib/schemas/` and `src/lib/schemas/` (the business rules), everything in `lib/actions/` and `src/lib/actions/`, and the database invariants already covered by `db/tests/`. These are the boundaries that stop six slices inventing six eligibility rules.

**Should.** Any non-trivial pure function in `lib/`. If the function encodes a decision, write the cases down. If it joins strings, leave it.

**Must not.** Snapshot tests, component visual tests, and tests that assert on class names. Snapshots get updated without being read. Visual tests chase pixels this team will not maintain. Class-name assertions break when the design system is applied correctly.

## How this is enforced

CI fails if a source file is added under those schema or action directories without a matching `.test.ts` (or `.test.tsx`) sibling. Coverage is printed on every CI run so gaps are visible. There is no coverage threshold.
