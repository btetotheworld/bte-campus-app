# D-003 Record archetype

Status: `draft`. Canonical example: one chapter.

Do not invent a new record layout. Every person, chapter, application, meeting, or submission is this page with a different definition list.

## Purpose

Read one record, see its facts, and take the one or two actions that belong to it.

## Layout

1. `PageHeader`. Title is the record name. Breadcrumbs fold in (Chapters / UNILAG). Optional action is the primary mutation for this record.
2. `StatusBadge` sits next to the title or in the first definition row, not as decoration in a card header.
3. `DefinitionList` for the facts. Two columns on desktop, one on small screens. Labels are `meta-label`. Values are body.
4. A related list, if one exists, is a `DataTable` or `RosterRow` list under an `h2`. It is not a second page type.
5. If a related list is empty, `EmptyState` under that heading.

Content max width `1200px`. Spacing 32 between groups, 48 before a new section.

## States

| State     | What the user sees                                         |
| --------- | ---------------------------------------------------------- |
| Loading   | `PageHeader` plus skeleton rows in the definition list.    |
| Missing   | `EmptyState`. The record is not here. Offer a way back.    |
| Error     | `Alert` destructive. What failed, and what to do next.     |
| Populated | Facts, then the related list or empty state for that list. |

## Components

`PageHeader`, `DefinitionList`, `StatusBadge`, `RosterRow`, `DataTable`, `EmptyState`, `StepProgress` when the record has gates (a chapter approval).

## Out of scope

Editing the record in place. Edits are `D-004`. Cross-record counts. Those are `D-005`.

## Canonical example

UNILAG Campus Chapter. Facts: institution, lead, assistant lead, status, term. Roster of members. Approval gates as `StepProgress`.
