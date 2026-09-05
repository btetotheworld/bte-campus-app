import type { Metadata } from "next";
import { PageHeader } from "@/components/bte/page-header";
import { StatTile } from "@/components/bte/stat-tile";
import { EmptyState } from "@/components/bte/empty-state";

export const metadata: Metadata = {
  title: "Home",
};

export default function PlatformHomePage() {
  return (
    <>
      <PageHeader
        title="Home"
        description="Coordinator view for the current cohort. Counts stay at zero until this screen reads the database."
      />

      <section className="mb-12 grid grid-cols-1 gap-6 md:grid-cols-3">
        <StatTile label="Live chapters" value="0" hint="None loaded yet" />
        <StatTile
          label="Applications in review"
          value="0"
          hint="None loaded yet"
        />
        <StatTile label="Reviews past due" value="0" hint="None loaded yet" />
      </section>

      <section>
        <h2 className="mb-6 text-h2">Needs attention</h2>
        <EmptyState message="Nothing needs you today. Flags will appear here once chapters file reports and reviews open." />
      </section>
    </>
  );
}
