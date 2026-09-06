import Link from "next/link";
import { DataTable } from "@/components/bte/data-table";
import type { Database } from "@/lib/db/types";

type Department = Pick<
  Database["public"]["Tables"]["departments"]["Row"],
  "id" | "name" | "kind"
>;

export function DepartmentTable({
  rows,
  loading = false,
}: {
  rows: Department[];
  loading?: boolean;
}) {
  return (
    <DataTable
      caption="Departments"
      rows={rows}
      state={loading ? "loading" : "populated"}
      getRowKey={(row) => row.id}
      columns={[
        {
          key: "name",
          header: "Department",
          cell: (row) => (
            <Link
              href={`/departments/${row.id}`}
              className="text-navy underline"
            >
              {row.name}
            </Link>
          ),
        },
        {
          key: "kind",
          header: "Kind",
          cell: (row) => (row.kind === "team" ? "Team" : "Campus chapter"),
        },
      ]}
    />
  );
}
