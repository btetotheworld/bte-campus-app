import { EmptyState } from "@/components/bte/empty-state";
import { PageHeader } from "@/components/bte/page-header";
import { PublicDepartmentTable } from "./department-table";
import { loadPublicDepartments } from "./public-directory-data";

export const metadata = { title: "BTE teams and departments" };

export default async function PublicTeamPage() {
  const departments = await loadPublicDepartments();
  return (
    <>
      <PageHeader
        title="BTE teams and departments"
        description="Meet the verified volunteers serving across BTE."
      />
      {departments.length ? (
        <PublicDepartmentTable departments={departments} />
      ) : (
        <EmptyState message="There are no public departments to show yet." />
      )}
    </>
  );
}
