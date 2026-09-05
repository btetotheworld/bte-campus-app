# D-004 Form archetype

Status: `draft`. Canonical example: sign in.

Do not invent a new form layout. Applications, meeting reports, and password reset all use this page.

## Purpose

Collect a small set of fields, validate them, and submit. One primary action.

## Layout

1. `PageHeader` when the form is inside the platform shell. On an unauthenticated screen (sign in, password reset) the logo plus an `h1` stand in for the header. Do not add breadcrumbs on those screens.
2. Fields stack. Label above the control, always, via `FormField`. Placeholder is never the label.
3. `Stepper` only when the form is a known sequence of three or more steps (an application). Sign in has no stepper.
4. Help text is `text-sm` in `ink-muted`, under the field.
5. Errors are a sentence under the field, and `aria-invalid` on the control. A red border alone is not enough.
6. One primary button. Secondary actions are ghost or a text link.

Content max width is the form column, not the full `1200px`. Keep the column readable. Page padding 16 / 24 / 32.

## States

| State      | What the user sees                                              |
| ---------- | --------------------------------------------------------------- |
| Default    | Empty fields, labels visible.                                   |
| Invalid    | Field error sentences. Focus moves to the first invalid field.  |
| Submitting | Primary button `loading`. Controls disabled.                    |
| Error      | `Alert` destructive above the fields. What happened, what next. |
| Success    | Navigate away, or one sentence that the save worked.            |

## Components

`FormField`, `Stepper` (when sequenced), `Button`, `Alert`. Sign in does not use `Chip` or `DataTable`.

## Out of scope

A table of drafts (`D-002`). The record after save (`D-003`).

## Canonical example

Sign in. Email, password, primary button "Sign in", link to "Reset your password". Journey `X1`. Password reset is the same archetype with one field.
