import type { Metadata } from "next";
import { PageHeader } from "@/components/bte/page-header";
import { DefinitionList } from "@/components/bte/definition-list";
import { RosterRow } from "@/components/bte/roster-row";
import { StatusBadge } from "@/components/bte/status-badge";
import { StepProgress } from "@/components/bte/step-progress";

export const metadata: Metadata = {
  title: "Record archetype",
};

export default function RecordArchetypePage() {
  return (
    <>
      <p className="meta-label mb-2 text-ink-muted">D-003</p>
      <PageHeader
        title="UNILAG Campus Chapter"
        description="Example record. Facts below are the synthetic seed, not a live chapter."
        crumbs={[{ href: "/styleguide/list", label: "Chapters" }]}
      />

      <section className="mb-12">
        <DefinitionList
          items={[
            {
              label: "Status",
              value: <StatusBadge label="Active" tone="success" />,
            },
            { label: "Institution", value: "University of Lagos" },
            { label: "Lead", value: "Tobi Adeyemi" },
            { label: "Assistant lead", value: "Ngozi Umeh" },
            { label: "Term", value: "2025/2026, term 1" },
          ]}
        />
      </section>

      <section className="mb-12">
        <h2 className="mb-6 text-h2">Approval gates</h2>
        <StepProgress
          steps={[
            { label: "People", state: "done" },
            { label: "Selection", state: "done" },
            { label: "Fellowship", state: "done" },
            { label: "Venue", state: "done" },
            { label: "Commitment", state: "done" },
            { label: "Onboarding", state: "done" },
            { label: "Systems", state: "done" },
            { label: "Letter", state: "done" },
          ]}
        />
      </section>

      <section>
        <h2 className="mb-6 text-h2">Roster</h2>
        <RosterRow
          name="Bisi Lawal"
          role="Member"
          status={<StatusBadge label="Member" />}
        />
        <RosterRow
          name="Femi Bello"
          role="Observer"
          status={<StatusBadge label="Observer" tone="warning" />}
        />
      </section>
    </>
  );
}
