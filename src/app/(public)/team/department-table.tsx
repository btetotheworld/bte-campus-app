import Link from "next/link";
import { DataTable } from "@/components/bte/data-table";
import type { PublicDepartment } from "./public-directory-data";

export function PublicDepartmentTable({
  departments,
}: {
  departments: PublicDepartment[];
}) {
  return (
    <DataTable
      caption="BTE departments"
      rows={departments}
      getRowKey={(department) => department.id}
      columns={[
        {
          key: "department",
          header: "Department",
          cell: (department) => (
            <Link
              href={`/team/${department.id}`}
              className="text-navy underline focus-visible:outline-solid"
            >
              {department.name}
            </Link>
          ),
        },
        {
          key: "kind",
          header: "Kind",
          cell: (department) =>
            department.kind === "campus_chapter"
              ? "Campus chapter"
              : "BTE team",
        },
        {
          key: "team",
          header: "Team",
          cell: (department) =>
            department.team.length === 1
              ? "1 person"
              : `${department.team.length} people`,
        },
      ]}
    />
  );
}
