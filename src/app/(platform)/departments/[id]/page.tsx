import { notFound } from "next/navigation";
import { ModuleGate } from "@/app/(platform)/module-gate";
import { loadPlatformAccess } from "@/lib/auth/permissions";
import { canAccess } from "@/lib/auth/nav-access";
import { PageHeader } from "@/components/bte/page-header";
import { DefinitionList } from "@/components/bte/definition-list";
import { StatusBadge } from "@/components/bte/status-badge";
import { createClient } from "@/lib/supabase/server";

export const metadata = { title: "Department" };

const DEPARTMENT_ID =
  /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i;

export default async function DepartmentPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const access = await loadPlatformAccess();
  if (!canAccess(access, "departments", "read")) {
    return (
      <ModuleGate
        access={access}
        module="departments"
        operation="read"
        title="Departments"
      >
        {null}
      </ModuleGate>
    );
  }
  const { id } = await params;
  if (!DEPARTMENT_ID.test(id)) notFound();
  const supabase = await createClient();
  const { data, error } = await supabase
    .from("departments")
    .select("id, name, kind, archived_at")
    .eq("id", id)
    .maybeSingle();
  if (error) throw new Error("The department could not be loaded.");
  if (!data) notFound();
  return (
    <>
      <PageHeader
        title={data.name}
        crumbs={[{ href: "/departments", label: "Departments" }]}
      />
      <DefinitionList
        items={[
          {
            label: "Status",
            value: (
              <StatusBadge label={data.archived_at ? "Archived" : "Active"} />
            ),
          },
          {
            label: "Kind",
            value: data.kind === "team" ? "Team" : "Campus chapter",
          },
        ]}
      />
    </>
  );
}
