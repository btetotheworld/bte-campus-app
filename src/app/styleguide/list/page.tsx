import type { Metadata } from "next";
import Link from "next/link";
import { PageHeader } from "@/components/bte/page-header";
import { DataTable } from "@/components/bte/data-table";
import { StatusBadge } from "@/components/bte/status-badge";
import { ListFilters } from "@/app/styleguide/list/list-filters";

export const metadata: Metadata = {
  title: "List archetype",
};

type ExampleChapter = {
  id: string;
  name: string;
  institution: string;
  lead: string;
  status: "Active" | "At risk";
  tone: "success" | "warning";
};

const EXAMPLE_CHAPTERS: ExampleChapter[] = [
  {
    id: "example-unilag",
    name: "UNILAG Campus Chapter",
    institution: "University of Lagos",
    lead: "Tobi Adeyemi",
    status: "Active",
    tone: "success",
  },
  {
    id: "example-oau",
    name: "OAU Campus Chapter",
    institution: "Obafemi Awolowo University",
    lead: "Kunle Afolabi",
    status: "At risk",
    tone: "warning",
  },
];

export default function ListArchetypePage() {
  return (
    <>
      <p className="meta-label mb-2 text-ink-muted">D-002</p>
      <PageHeader
        title="Chapters"
        description="Example list. These two rows are the synthetic seed chapters, not live data."
      />
      <ListFilters />
      <DataTable
        caption="Example chapters"
        columns={[
          {
            key: "name",
            header: "Chapter",
            cell: (row) => (
              <Link href="/styleguide/record" className="text-navy underline">
                {row.name}
              </Link>
            ),
          },
          {
            key: "institution",
            header: "Institution",
            cell: (row) => row.institution,
          },
          {
            key: "lead",
            header: "Lead",
            cell: (row) => row.lead,
          },
          {
            key: "status",
            header: "Status",
            cell: (row) => <StatusBadge label={row.status} tone={row.tone} />,
          },
        ]}
        rows={EXAMPLE_CHAPTERS}
        getRowKey={(row) => row.id}
      />
    </>
  );
}
