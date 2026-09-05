import type { Metadata } from "next";
import { SlicePlaceholder } from "@/app/(platform)/slice-placeholder";

export const metadata: Metadata = { title: "Applications" };

export default function ApplicationsPage() {
  return (
    <SlicePlaceholder
      title="Applications"
      message="This application list has not been built yet. Assemble it from the list archetype on the styleguide."
    />
  );
}
