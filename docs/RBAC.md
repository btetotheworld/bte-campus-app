# RBAC.md

The access model for the BTE platform. Resolves issues 1 to 4 in `JOURNEYS.md` section 6.

---

## 1. Three things, not one

The documents use "role" for three separate concepts. Most access-control failures come from conflating them, so they are separated here and never recombined.

| Dimension      | Question                | Example                                         |
| -------------- | ----------------------- | ----------------------------------------------- |
| **Permission** | What may you act on?    | Read meeting reports. Confirm an approval gate. |
| **Scope**      | Where does it apply?    | All chapters. One chapter. Your own record.     |
| **Visibility** | Are you shown publicly? | On the team page, or not yet.                   |

A Program Coordinator and a Campus Lead may both hold "read meeting reports." They differ only in scope. A campus lead in their first week has full chapter permissions and no public visibility at all.

---

## 2. Visibility is not permission

**This resolves `JOURNEYS` issue 2.**

The conflict: People Management auto-verifies a person after 90 days, at which point they become publicly visible. A campus lead is selected and must run a chapter immediately. Two documents appeared to disagree.

They do not. `pending → verified → hidden → inactive` describes **whether a person appears on the public team and department pages**. It says nothing about what they can do.

- A campus lead is `pending` for their first 90 days, invisible on the public site, and has full permissions over their chapter from day one.
- At 90 days they auto-verify, appear publicly, and receive the Called badge. Permissions do not change.
- `hidden` removes someone from public listings. Permissions unchanged.

**One exception, and it is a security matter rather than a display one.** `inactive` means someone has left. It must revoke access, not merely hide a profile. The documents describe these states as display-only, which would leave a departed volunteer able to sign in. Setting `inactive` disables the login and ends live sessions.

---

## 3. Person kinds

**This resolves `JOURNEYS` issue 3.**

Campus students need accounts to post build logs and submit work. They are not volunteers, appear on no team page, and hold no tenure badge. Rather than a second people model, add one column.

| Kind        | Publicly listed    | Earns badges | Examples                                            |
| ----------- | ------------------ | ------------ | --------------------------------------------------- |
| `team`      | Yes, once verified | Yes          | Founder, leads, assistants, volunteers, coordinator |
| `community` | No                 | No           | Campus students, external submitters                |

Campus **leads** are `team`. They are BTE volunteers who run a chapter. Campus **members** are `community`. One `people` table, one auth model, one column of difference.

---

## 4. Applicants are people from the moment they apply

**This resolves `JOURNEYS` issues 1 and 4.**

The documents assume a person record is created after an application is approved, and name "who creates it" as an undefined gap. That ordering causes three problems: an applicant cannot save a draft and return, someone reapplying next cohort has no history, and the schema currently has `applications.lead_person_id` pointing at a `people` row that does not yet exist.

**Proposal: the system creates the `people` row at application, with status `pending` and kind `community`.**

- `pending` already means invisible, so nothing leaks onto the public site.
- Approval is a separate act. It changes kind to `team`, assigns a membership, and starts the 90-day clock. That is the admin action the SOP needs to own, and the gap becomes "who approves", which is answerable, rather than "who creates a record", which nobody wanted to own.
- A declined applicant becomes `inactive`. The record and history remain, which matters because declined applicants are explicitly encouraged to reapply.

Applicants hold exactly one permission: read and write their own application, until it is submitted.

---

## 5. Modules

Permissions attach to modules, per People Logic 7. An admin is granted specific modules, never all-or-nothing.

| Domain   | Modules                                                                                                                                                                                                |
| -------- | ------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------ |
| People   | `departments` · `people` · `join_apps` · `badges` · `communications` · `people_settings`                                                                                                               |
| Campus   | `cohorts` · `campus_applications` · `interviews` · `fellowships` · `chapters` · `approvals` · `meetings` · `reports` · `chapter_members` · `build_logs` · `escalations` · `succession` · `shift_packs` |
| Showcase | `submissions` · `reviews` · `selection`                                                                                                                                                                |
| Platform | `audit` · `settings`                                                                                                                                                                                   |

Operations: `read` `create` `update` `delete`, plus four that are deliberately their own permission because they are consequential and rare:

`approve` · `confirm_gate` · `issue_outcome` · `sign`

`sign` belongs to the founder alone. Gate 8, the fellowship letter, is the case that matters.

---

## 6. Roles are bundles

A role is a named set of module permissions. It is not a column on `people`.

### Platform roles: global scope

| Role                  | Holds                                                                            |
| --------------------- | -------------------------------------------------------------------------------- |
| `founder`             | Everything, plus `sign`, plus sole authority to close a chapter or remove a lead |
| `people_manager`      | All People modules. Not Campus, not Showcase.                                    |
| `program_coordinator` | All Campus modules except `sign`. Read on People.                                |
| `showcase_owner`      | All Showcase modules. Read on chapters and members.                              |
| `reviewer`            | Read assigned submissions, write own reviews. Nothing else.                      |
| `auditor`             | Read-only across everything, plus `audit`. For governance review.                |

### Membership roles: scoped

| Role             | Scope          | Holds                                                                |
| ---------------- | -------------- | -------------------------------------------------------------------- |
| `team_lead`      | One department | Read own department's people. Notified of new pending volunteers.    |
| `assistant`      | One department | Same as team lead                                                    |
| `volunteer`      | One department | Read own department. Write own profile.                              |
| `campus_lead`    | One chapter    | Full write on that chapter's meetings, reports, members, escalations |
| `assistant_lead` | One chapter    | Identical to campus lead. Deliberately not lesser.                   |
| `practitioner`   | One chapter    | Read that chapter                                                    |
| `chapter_member` | One chapter    | Read chapter. Write own build logs and submissions.                  |

### Non-roles

`applicant`: no membership, own application only. `anon`: public pages, submit an application.

**A person's permissions are the union of their platform roles and every membership role they hold.** One person can be a volunteer in Media, a campus lead at Unilag, and a reviewer. That is normal and the model handles it without special cases.

---

## 7. Scope

Three scopes. Every permission carries one.

| Scope            | Meaning                                                               |
| ---------------- | --------------------------------------------------------------------- |
| `global`         | All records of that type                                              |
| `own_department` | Records belonging to a department where the person holds a membership |
| `own_chapter`    | Records belonging to a chapter where the person holds a membership    |
| `self`           | Records where the person is the subject                               |

`own_chapter` is a specialisation of `own_department`, because a chapter is a department. That falls out of the schema rather than being a special case.

Three scope rules that matter more than they look:

1. **A campus lead cannot read another chapter's reports.** Cohort camaraderie is social, not a data permission.
2. **A chapter member cannot read another member's submission or review.**
3. **An applicant can never read their own scores or interview scorecard.** Not hidden in the UI. Not queryable. Outcomes are communicated by letter.

---

## 8. Sensitive cases

| Case                   | Rule                                                                                                                                                                        |
| ---------------------- | --------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| Safety escalations     | `category = 'safety'` is readable by the founder and coordinator only. Not by other leads, not by an auditor without explicit grant.                                        |
| Reviewer conflicts     | A reviewer who has declared a relationship is blocked from that submission at the policy level, not by convention. Nobody reviews work from their own chapter.              |
| Minors                 | Where date of birth indicates under 18, the profile is never publicly listed regardless of status, and photo upload requires recorded guardian consent. See open decisions. |
| Application scores     | Readable by `program_coordinator` and `founder` only. Never the applicant, never their partner.                                                                             |
| Person contact details | Readable within own department, and globally only by `people_manager` and above. Not by every signed-in user.                                                               |

---

## 9. Implementation

RLS is the boundary. The UI hiding a button is presentation.

**Two new tables.** This is a migration, `0002_rbac.sql`, before `0003_rls.sql`:

```
platform_roles (person_id, role, granted_by, granted_at)
role_permissions (role, module, operation, scope)
```

`role_permissions` is data, not code. Changing what a coordinator can do is a row, not a deploy.

**Helper functions in Postgres**, called by every policy so the logic lives once:

```
current_person_id()                     -> uuid
has_permission(module, operation)       -> boolean   (global scope)
has_scoped(module, operation, dept_id)  -> boolean   (department or chapter)
is_member_of(chapter_id)                -> boolean
is_active()                             -> boolean   (false when inactive)
```

Every policy begins with `is_active()`. That is what makes offboarding real.

**Service role for scheduled jobs.** Auto-verify, badge awards, observer status transitions, overdue review alerts and the 60-day lapse all run with no user present. They use a dedicated service role that bypasses RLS, restricted to the specific tables each job touches. Never the general-purpose admin key.

---

## 10. Escalation guards

Rules that stop the model being used to climb it.

- **Nobody grants a role equal to or above their own.** A coordinator cannot make someone a founder.
- **Nobody grants themselves a role.** `granted_by <> person_id`, enforced by constraint.
- **A campus lead cannot appoint a campus lead.** Chapter roles are assigned by the coordinator, because a lead appointing their own successor is precisely what the succession policy exists to prevent.
- **Platform role grants are always audited**, with who, what and when.
- **Removing the last founder is blocked.**

---

## 11. Audit

Not specified anywhere in the documents, and needed. Append-only, nobody deletes.

Log: platform role grants and revocations, person status changes, approval gate confirmations, outcome issuance, escalation resolution, chapter status changes, and every read of a safety escalation.

That last one is unusual and deliberate. Safety records should tell you who looked.

---

## 12. Getting an account

Not covered by any document.

- **Applicants** self-register. Email verification, no invite.
- **Selected campus leads** receive an invite at outcome, tied to their existing applicant account. They do not create a second one.
- **Volunteers** are invited when their join application is approved.
- **Platform roles** are granted by the founder to an existing account. No account is created by granting a role.

Sessions end on `inactive`. Password reset is standard Supabase.

---

## 13. Open decisions

| #   | Decision                                                                                                                                                                                                                                    |
| --- | ------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| 1   | **Minors.** Some 100-level students will be under 18. Do they get accounts at all? If yes, no public profile, no photo without guardian consent, and a separate consent record. This needs deciding before any student signs up, not after. |
| 2   | **NDPR.** Photos, dates of birth, contact details and student data. A retention period, a deletion route, and a privacy notice at signup. Currently nothing exists.                                                                         |
| 3   | **Public profile consent.** Auto-verification makes someone public at 90 days without them agreeing to it. Capture consent at onboarding, or make public listing opt-in.                                                                    |
| 4   | **Does the founder hold `auditor`?** Separating them means the founder cannot silently read safety records. Worth considering even in a small organisation.                                                                                 |
| 5   | **Break-glass.** If the coordinator is unreachable and a chapter needs an urgent change, does the founder act directly, and is that logged differently?                                                                                     |
| 6   | **Do team leads get any admin surface at all,** or is People entirely a `people_manager` function? People Logic proposes notifying leads of new pending volunteers, which implies at least a read view.                                     |

Items 1 and 2 are the ones I would not carry into a sprint unresolved. Everything else can be decided as it is built.
