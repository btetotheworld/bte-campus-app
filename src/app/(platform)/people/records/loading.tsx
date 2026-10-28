import { PageHeader } from "@/components/bte/page-header";
import { DataTable } from "@/components/bte/data-table";

export default function Loading() {
  return (
    <div role="status" aria-label="Loading person records">
      <PageHeader title="Person records" />
      <DataTable
        caption="Person records"
        state="loading"
        rows={[]}
        getRowKey={() => "loading"}
        columns={[
          { key: "name", header: "Name", cell: () => null },
          { key: "status", header: "Status", cell: () => null },
          { key: "kind", header: "Kind", cell: () => null },
        ]}
      />
    </div>
  );
}
