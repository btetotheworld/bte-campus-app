import Link from "next/link";
import { ModuleGate } from "@/app/(platform)/module-gate";
import { loadPlatformAccess } from "@/lib/auth/permissions";
import { canAccess } from "@/lib/auth/nav-access";
import { PageHeader } from "@/components/bte/page-header";
import { DefinitionList } from "@/components/bte/definition-list";
import { StatusBadge } from "@/components/bte/status-badge";
import { buttonVariants } from "@/components/ui/button";
import { loadPersonRecord, personStatusLabels } from "../record-data";

export const metadata = { title: "Person record" };
const date = (value: string) =>
  new Intl.DateTimeFormat("en-GB", {
    dateStyle: "medium",
    timeStyle: "short",
    timeZone: "Africa/Lagos",
  }).format(new Date(value)) + " WAT";

export default async function PersonRecordPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const access = await loadPlatformAccess();
  if (!canAccess(access, "people", "read")) {
    return (
      <ModuleGate
        access={access}
        module="people"
        operation="read"
        title="Person record"
      >
        {null}
      </ModuleGate>
    );
  }
  const person = await loadPersonRecord((await params).id);
  return (
    <>
      <PageHeader
        title={person.full_name}
        crumbs={[
          { href: "/people", label: "People" },
          { href: "/people/records", label: "Person records" },
        ]}
        action={
          canAccess(access, "people", "update") && person.contact ? (
            <Link
              href={`/people/records/${person.id}/edit`}
              className={buttonVariants({
                size: "touch",
                className: "focus-visible:outline-solid",
              })}
            >
              Edit person record
            </Link>
          ) : undefined
        }
      />
      <DefinitionList
        items={[
          {
            label: "Status",
            value: <StatusBadge label={personStatusLabels[person.status]} />,
          },
          {
            label: "Kind",
            value: person.kind === "team" ? "Team" : "Community",
          },
          ...(person.contact
            ? [
                { label: "Email", value: person.contact.email },
                {
                  label: "Phone",
                  value: person.contact.phone || "No phone number recorded.",
                },
              ]
            : [
                {
                  label: "Contact details",
                  value:
                    "You do not have access to this person's contact details.",
                },
              ]),
          {
            label: "Graduation year",
            value: person.graduation_year ?? "No graduation year recorded.",
          },
          {
            label: "Year group",
            value: person.year_group ?? "No year group recorded.",
          },
          { label: "Created at", value: date(person.created_at) },
          {
            label: "Verified at",
            value: person.verified_at
              ? date(person.verified_at)
              : "This person has not been verified.",
          },
        ]}
      />
      {person.status === "pending" ? (
        <p className="mt-8 text-body text-ink-secondary">
          Pending hides the public profile. It does not remove this
          person&apos;s assigned access.
        </p>
      ) : null}
    </>
  );
}
