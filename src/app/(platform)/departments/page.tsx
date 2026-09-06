import Link from "next/link";
import { redirect } from "next/navigation";
import { PageHeader } from "@/components/bte/page-header";
import { EmptyState } from "@/components/bte/empty-state";
import { buttonVariants } from "@/components/ui/button";
import { createClient } from "@/lib/supabase/server";
import { getDepartmentAccess } from "./access";
import { DepartmentTable } from "./department-table";

export const metadata = { title: "Departments" };

export default async function DepartmentsPage() {
  const access = await getDepartmentAccess();
  if (!access.signedIn) redirect("/sign-in?next=%2Fdepartments");
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
  const createLink = access.canCreate ? (
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
