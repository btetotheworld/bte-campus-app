import type { Metadata } from "next";
import { GatedPlaceholder } from "@/app/(platform)/module-gate";

export const metadata: Metadata = { title: "Applications" };

export default function ApplicationsPage() {
  return (
    <GatedPlaceholder
      title="Applications"
      module="campus_applications"
      operation="read"
      message="This application list has not been built yet. Assemble it from the list archetype on the styleguide."
    />
  );
}
