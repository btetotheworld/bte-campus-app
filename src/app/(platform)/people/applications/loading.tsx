import { DataTable } from "@/components/bte/data-table";
import { PageHeader } from "@/components/bte/page-header";

export default function Loading() {
  return (
    <div role="status" aria-label="Loading join applications">
      <PageHeader title="Join applications" />
      <DataTable
        caption="Submitted join applications"
        state="loading"
        rows={[]}
        getRowKey={() => "loading"}
        columns={[
          { key: "applicant", header: "Applicant", cell: () => null },
          { key: "department", header: "Department", cell: () => null },
          { key: "submitted", header: "Submitted", cell: () => null },
          { key: "status", header: "Status", cell: () => null },
        ]}
      />
    </div>
  );
}
