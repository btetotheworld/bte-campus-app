# D-005 Dashboard archetype

Status: `draft`. Canonical example: the signed-in home.

Do not invent a new dashboard. Home for a coordinator, a lead, or a member is this page with different tiles and flags.

## Purpose

See what needs attention, then leave. It is not a list of every record and not a report.

## Layout

1. `PageHeader`. Title is Home, or the person's chapter name for a lead. Description is one sentence about the current term or cohort, not a greeting.
2. A short row of `StatTile`. Three or four. Each tile is a number plus a noun (Chapters, Meetings this term, Reviews due). The number is navy or ink, never ember. Ember may be a 4px rule on one tile only if this screen has no other accent.
3. `FlagCard` list for things a person must act on. One card per flag. Title, one sentence, one action. Severity uses `warning` or `danger` plus the word, never colour alone.
4. If there are no flags, `EmptyState`. "Nothing needs you today" is allowed. Do not invent a flag to fill the space.

Content max width `1200px`. Tiles sit in a three or four column grid from the tablet breakpoint. One column on small screens. Spacing 24 between tiles, 48 before the flags.

## States

| State     | What the user sees                                     |
| --------- | ------------------------------------------------------ |
| Loading   | Skeleton tiles. No placeholder numbers that look real. |
| Empty     | Tiles at zero if that is true, plus the empty flags.   |
| Error     | `Alert` destructive. What failed, and what to do next. |
| Populated | Tiles and the flag list.                               |

## Components

`PageHeader`, `StatTile`, `FlagCard`, `EmptyState`. A dashboard does not start with a `DataTable`. If a person needs the full list, the tile or flag links to `D-002`.

## Out of scope

The chapter record (`D-003`). Creating a record (`D-004`). Charts, rankings, badges for student work.

## Canonical example

Coordinator home. Tiles: live chapters, applications in review, reviews past due. Flags: a chapter missing this week's report, a review window that closes tomorrow.
