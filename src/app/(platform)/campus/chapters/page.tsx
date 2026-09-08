import type { Metadata } from "next";
import { GatedPlaceholder } from "@/app/(platform)/module-gate";

export const metadata: Metadata = { title: "Chapters" };

export default function ChaptersPage() {
  return (
    <GatedPlaceholder
      title="Chapters"
      module="chapters"
      operation="read"
      message="This chapter list has not been built yet. Assemble it from the list archetype on the styleguide."
    />
  );
}
