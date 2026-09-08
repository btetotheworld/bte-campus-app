import type { Metadata } from "next";
import { GatedPlaceholder } from "@/app/(platform)/module-gate";

export const metadata: Metadata = { title: "Submissions" };

export default function SubmissionsPage() {
  return (
    <GatedPlaceholder
      title="Submissions"
      module="submissions"
      operation="read"
      message="This submission list has not been built yet. Assemble it from the list archetype on the styleguide."
    />
  );
}
