import type { Metadata } from "next";
import { SlicePlaceholder } from "@/app/(platform)/slice-placeholder";

export const metadata: Metadata = { title: "Health" };

export default function HealthPage() {
  return (
    <SlicePlaceholder
      title="Health"
      message="Chapter health has not been built yet. Assemble it from the dashboard archetype on the styleguide."
    />
  );
}
