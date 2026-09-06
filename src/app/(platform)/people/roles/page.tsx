import type { Metadata } from "next";
import { PageHeader } from "@/components/bte/page-header";
import { EmptyState } from "@/components/bte/empty-state";
import { DataTable } from "@/components/bte/data-table";
import { getSessionPerson } from "@/lib/auth/session";
import { createClient } from "@/lib/supabase/server";
import type { platform_role } from "@/lib/db/types";
import { GrantRoleForm } from "@/app/(platform)/people/roles/grant-role-form";
import { RevokeRoleButton } from "@/app/(platform)/people/roles/revoke-role-button";

export const metadata: Metadata = { title: "Platform roles" };

const ROLE_LABELS: Record<platform_role, string> = {
  founder: "Founder",
  people_manager: "People manager",
  program_coordinator: "Program coordinator",
  showcase_owner: "Showcase owner",
  reviewer: "Reviewer",
  auditor: "Auditor",
};

function formatWat(iso: string) {
  return new Intl.DateTimeFormat("en-GB", {
    timeZone: "Africa/Lagos",
    dateStyle: "medium",
    timeStyle: "short",
  }).format(new Date(iso));
}

export default async function PlatformRolesPage() {
  const actor = await getSessionPerson();
  const supabase = await createClient();

  let isFounder = false;
  if (actor) {
    const { data: founderRow } = await supabase
      .from("platform_roles")
      .select("id")
      .eq("person_id", actor.id)
      .eq("role", "founder")
      .maybeSingle();
    isFounder = Boolean(founderRow);
  }

  if (!isFounder) {
    return (
      <>
        <PageHeader
          title="Platform roles"
          crumbs={[{ href: "/people", label: "People" }]}
        />
        <EmptyState message="Only a founder can grant or revoke platform roles." />
      </>
    );
  }

  const [grantsResult, peopleResult] = await Promise.all([
    supabase
      .from("platform_roles")
      .select("id, role, granted_at, person_id, granted_by")
      .order("granted_at", { ascending: false }),
    supabase.from("people").select("id, full_name").order("full_name"),
  ]);

  if (grantsResult.error || peopleResult.error) {
    return (
      <>
        <PageHeader
          title="Platform roles"
          crumbs={[{ href: "/people", label: "People" }]}
        />
        <DataTable
          caption="Platform role grants"
          columns={[]}
          rows={[]}
          getRowKey={() => "none"}
          state="error"
          errorMessage="The role list could not be loaded. Refresh the page."
        />
      </>
    );
  }

  const people = peopleResult.data ?? [];
  const names = new Map(people.map((person) => [person.id, person.full_name]));
  const grantablePeople = people.filter((person) => person.id !== actor?.id);
  const grants = grantsResult.data ?? [];

  return (
    <>
      <PageHeader
        title="Platform roles"
        description="Grant a role to an existing person. Nobody gets an account from a grant."
        crumbs={[{ href: "/people", label: "People" }]}
      />

      <section className="mb-12">
        <h2 className="mb-6 text-h2">Grant a role</h2>
        <GrantRoleForm people={grantablePeople} />
      </section>

      <section>
        <h2 className="mb-6 text-h2">Current grants</h2>
        <DataTable
          caption="Current platform role grants"
          state={grants.length === 0 ? "empty" : "populated"}
          empty={
            <EmptyState message="No platform roles have been granted yet." />
          }
          columns={[
            {
              key: "person",
              header: "Person",
              cell: (row) => names.get(row.person_id) ?? row.person_id,
            },
            {
              key: "role",
              header: "Role",
              cell: (row) => ROLE_LABELS[row.role],
            },
            {
              key: "granted",
              header: "Granted",
              cell: (row) => formatWat(row.granted_at),
            },
            {
              key: "by",
              header: "Granted by",
              cell: (row) => names.get(row.granted_by) ?? row.granted_by,
            },
            {
              key: "revoke",
              header: "Revoke",
              cell: (row) => <RevokeRoleButton assignmentId={row.id} />,
            },
          ]}
          rows={grants}
          getRowKey={(row) => row.id}
        />
      </section>
    </>
  );
}
