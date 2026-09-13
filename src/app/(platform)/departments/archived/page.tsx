import Link from "next/link";
import { ModuleGate } from "@/app/(platform)/module-gate";
import { PageHeader } from "@/components/bte/page-header";
import { EmptyState } from "@/components/bte/empty-state";
import { loadPlatformAccess } from "@/lib/auth/permissions";
import { canAccess } from "@/lib/auth/nav-access";
import { createClient } from "@/lib/supabase/server";
import { DepartmentTable } from "../department-table";

export const metadata = { title: "Archived departments" };

export default async function ArchivedDepartmentsPage() {
  const access = await loadPlatformAccess();
  if (!canAccess(access, "departments", "read")) {
    return (
      <ModuleGate
        access={access}
        module="departments"
        operation="read"
        title="Archived departments"
      >
        {null}
      </ModuleGate>
    );
  }
  const supabase = await createClient();
  const { data, error } = await supabase
    .from("departments")
    .select("id, name, kind")
    .not("archived_at", "is", null)
    .order("name")
    .order("id");
  if (error) throw new Error("Archived departments could not be loaded.");
  return (
    <>
      <PageHeader
        title="Archived departments"
        description="Open an archived department to read its record."
        crumbs={[{ href: "/departments", label: "Departments" }]}
      />
      {data?.length ? (
        <DepartmentTable rows={data} />
      ) : (
        <EmptyState
          message="There are no archived departments you can access."
          action={
            <Link
              href="/departments"
              className="inline-flex min-h-(--control-height-touch) items-center text-navy underline focus-visible:outline-solid"
            >
              View active departments
            </Link>
          }
        />
      )}
    </>
  );
}
