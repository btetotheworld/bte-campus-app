import type { Metadata } from "next";
import { SlicePlaceholder } from "@/app/(platform)/slice-placeholder";

export const metadata: Metadata = { title: "Submissions" };

export default function SubmissionsPage() {
  return (
    <SlicePlaceholder
      title="Submissions"
      message="This submission list has not been built yet. Assemble it from the list archetype on the styleguide."
    />
  );
}
