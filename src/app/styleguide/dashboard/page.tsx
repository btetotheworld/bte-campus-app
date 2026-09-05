import type { Metadata } from "next";
import Link from "next/link";
import { PageHeader } from "@/components/bte/page-header";
import { StatTile } from "@/components/bte/stat-tile";
import { FlagCard } from "@/components/bte/flag-card";

export const metadata: Metadata = {
  title: "Dashboard archetype",
};

export default function DashboardArchetypePage() {
  return (
    <>
      <p className="meta-label mb-2 text-ink-muted">D-005</p>
      <PageHeader
        title="Home"
        description="Example coordinator home. The numbers and flags are labelled as examples. The live home stays at zero until it reads the database."
      />

      <section className="mb-12 grid grid-cols-1 gap-6 md:grid-cols-3">
        <StatTile label="Live chapters" value="2" hint="Example count" />
        <StatTile
          label="Applications in review"
          value="1"
          hint="Example count"
        />
        <StatTile label="Reviews past due" value="1" hint="Example count" />
      </section>

      <section>
        <h2 className="mb-6 text-h2">Needs attention</h2>
        <div className="flex flex-col gap-6">
          <FlagCard
            severity="warning"
            title="A chapter has not filed this week's report"
            body="Example flag for UNILAG. A live flag will name the chapter and the missed meeting."
            action={
              <Link
                href="/campus/meetings"
                className="text-sm font-semibold text-navy underline"
              >
                Open meetings
              </Link>
            }
          />
          <FlagCard
            severity="danger"
            title="A review window closes tomorrow"
            body="Example flag. A live flag will name the submission and the reviewer."
            action={
              <Link
                href="/campus/submissions"
                className="text-sm font-semibold text-navy underline"
              >
                Open submissions
              </Link>
            }
          />
        </div>
      </section>
    </>
  );
}
