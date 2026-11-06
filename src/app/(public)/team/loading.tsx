import { DataTable } from "@/components/bte/data-table";
import { PageHeader } from "@/components/bte/page-header";

export default function Loading() {
  return (
    <div role="status" aria-label="Loading BTE teams and departments">
      <PageHeader title="BTE teams and departments" />
      <DataTable
        caption="BTE departments"
        state="loading"
        rows={[]}
        getRowKey={() => "loading"}
        columns={[
          { key: "department", header: "Department", cell: () => null },
          { key: "kind", header: "Kind", cell: () => null },
          { key: "team", header: "Team", cell: () => null },
        ]}
      />
    </div>
  );
}
