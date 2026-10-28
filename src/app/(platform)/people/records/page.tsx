import Link from "next/link";
import { ModuleGate } from "@/app/(platform)/module-gate";
import { loadPlatformAccess } from "@/lib/auth/permissions";
import { canAccess } from "@/lib/auth/nav-access";
import { createClient } from "@/lib/supabase/server";
import { PageHeader } from "@/components/bte/page-header";
import { EmptyState } from "@/components/bte/empty-state";
import { DataTable } from "@/components/bte/data-table";
import { StatusBadge } from "@/components/bte/status-badge";
import { personStatusLabels } from "./record-data";

export const metadata = { title: "Person records" };

export default async function PersonRecordsPage() {
  const access = await loadPlatformAccess();
  if (!canAccess(access, "people", "read")) {
    return (
      <ModuleGate
        access={access}
        module="people"
        operation="read"
        title="Person records"
      >
        {null}
      </ModuleGate>
    );
  }
  const supabase = await createClient();
  const { data, error } = await supabase
    .from("people")
    .select("id, full_name, status, kind")
    .order("full_name")
    .order("id");
  if (error) throw new Error("Person records could not be loaded.");
  return (
    <>
      <PageHeader
        title="Person records"
        description="Open a person record to view or edit their details."
        crumbs={[{ href: "/people", label: "People" }]}
      />
      {data?.length ? (
        <DataTable
          caption="Person records"
          rows={data}
          getRowKey={(row) => row.id}
          columns={[
            {
              key: "name",
              header: "Name",
              cell: (row) => (
                <Link
                  href={`/people/records/${row.id}`}
                  className="text-navy underline focus-visible:outline-solid"
                >
                  {row.full_name}
                </Link>
              ),
            },
            {
              key: "status",
              header: "Status",
              cell: (row) => (
                <StatusBadge label={personStatusLabels[row.status]} />
              ),
            },
            {
              key: "kind",
              header: "Kind",
              cell: (row) => (row.kind === "team" ? "Team" : "Community"),
            },
          ]}
        />
      ) : (
        <EmptyState
          message="There are no person records you can access."
          action={
            <Link
              href="/people"
              className="text-navy underline focus-visible:outline-solid"
            >
              Back to people
            </Link>
          }
        />
      )}
    </>
  );
}
