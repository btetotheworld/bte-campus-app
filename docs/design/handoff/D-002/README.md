# D-002 List archetype

Status: `draft`. Canonical example: a chapter list.

Do not invent a new list layout. Every index in this product is this page with different columns and one empty state.

## Purpose

Scan many records of the same kind, filter them, and open one. Not a dashboard. Not a form.

## Layout

1. `PageHeader`. Title is the noun in the plural (Chapters). Description is one sentence. Primary action is the one create, if the role may create.
2. Optional filter row. `Chip` for on/off filters. `SegmentedControl` when the options are a closed set of three or fewer (All / Active / At risk).
3. `DataTable`. Navy header, mono uppercase labels, 44px rows. One primary column is a link to the record.
4. If the table is empty, do not render an empty table. Render `EmptyState`.

Content max width is `1440px` for data-dense tables, `1200px` otherwise. Page padding 16 / 24 / 32.

## States

| State     | What the user sees                                             |
| --------- | -------------------------------------------------------------- |
| Loading   | `DataTable` skeleton rows. No fake records.                    |
| Empty     | `EmptyState`. One sentence, one action.                        |
| Error     | `Alert` destructive. What failed, and what to do next.         |
| Populated | Table. Status via `StatusBadge`. Colour is never the only cue. |

## Components

`PageHeader`, `DataTable`, `EmptyState`, `StatusBadge`, `Chip`, `SegmentedControl`. No cards around the table.

## Out of scope

Record detail (`D-003`). Filters that need a full form (`D-004`). Counts and flags (`D-005`).

## Canonical example

Chapters. Columns: chapter, institution, lead, status, last meeting. Filter by status. Empty copy: "This cohort has no chapters yet."
