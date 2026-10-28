import { PageHeader } from "@/components/bte/page-header";
import { DepartmentTable } from "../department-table";

export default function Loading() {
  return (
    <div role="status" aria-label="Loading archived departments">
      <PageHeader title="Archived departments" />
      <DepartmentTable rows={[]} loading />
    </div>
  );
}
