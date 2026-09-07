import Link from "next/link";
import { ModuleGate } from "@/app/(platform)/module-gate";
import { PageHeader } from "@/components/bte/page-header";
import { EmptyState } from "@/components/bte/empty-state";
import { buttonVariants } from "@/components/ui/button";
import { createClient } from "@/lib/supabase/server";
import { loadPlatformAccess } from "@/lib/auth/permissions";
import { canAccess } from "@/lib/auth/nav-access";
import { DepartmentTable } from "./department-table";

export const metadata = { title: "Departments" };

export default async function DepartmentsPage() {
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
  const supabase = await createClient();
  // Alphabetical browsing only. Persisted display order awaits foundation work.
  const { data, error } = await supabase
    .from("departments")
    .select("id, name, kind")
    .is("archived_at", null)
    .order("name")
    .order("id");
  if (error) throw new Error("Departments could not be loaded.");
  const rows = data ?? [];
  // departments_write requires update permission for inserts too.
  const createLink =
    canAccess(access, "departments", "create") &&
    canAccess(access, "departments", "update") ? (
      <Link
        href="/departments/new"
        className={buttonVariants({
          size: "touch",
          className: "focus-visible:outline-solid",
        })}
      >
        Create department
      </Link>
    ) : undefined;

  return (
    <>
      <PageHeader
        title="Departments"
        description="Browse the departments you can access."
        action={rows.length ? createLink : undefined}
      />
      {rows.length ? (
        <DepartmentTable rows={rows} />
      ) : (
        <EmptyState
          message="There are no active departments you can access."
          action={createLink}
        />
      )}
    </>
  );
}
