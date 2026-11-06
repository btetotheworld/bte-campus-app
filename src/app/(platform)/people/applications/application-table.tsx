import Link from "next/link";
import { DataTable } from "@/components/bte/data-table";
import { StatusBadge } from "@/components/bte/status-badge";
import type { SubmittedApplication } from "./application-data";

const date = (value: string | null) =>
  value
    ? new Intl.DateTimeFormat("en-GB", {
        dateStyle: "medium",
        timeZone: "Africa/Lagos",
      }).format(new Date(value))
    : "Not recorded";

export function ApplicationTable({
  applications,
}: {
  applications: SubmittedApplication[];
}) {
  return (
    <DataTable
      caption="Submitted join applications"
      rows={applications}
      getRowKey={(application) => application.id}
      columns={[
        {
          key: "applicant",
          header: "Applicant",
          cell: (application) => (
            <Link
              href={`/people/applications/${application.id}`}
              className="text-navy underline focus-visible:outline-solid"
            >
              {application.person.full_name}
            </Link>
          ),
        },
        {
          key: "department",
          header: "Department",
          cell: (application) =>
            application.department?.name ?? "No department selected",
        },
        {
          key: "submitted",
          header: "Submitted",
          cell: (application) => date(application.submitted_at),
        },
        {
          key: "status",
          header: "Status",
          cell: () => <StatusBadge label="Submitted" />,
        },
      ]}
    />
  );
}
