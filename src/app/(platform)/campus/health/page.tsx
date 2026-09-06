import type { Metadata } from "next";
import { GatedPlaceholder } from "@/app/(platform)/module-gate";

export const metadata: Metadata = { title: "Health" };

export default function HealthPage() {
  return (
    <GatedPlaceholder
      title="Health"
      module="succession"
      operation="read"
      message="Chapter health has not been built yet. Assemble it from the dashboard archetype on the styleguide."
    />
  );
}
