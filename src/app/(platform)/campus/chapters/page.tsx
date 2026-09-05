import type { Metadata } from "next";
import { SlicePlaceholder } from "@/app/(platform)/slice-placeholder";

export const metadata: Metadata = { title: "Chapters" };

export default function ChaptersPage() {
  return (
    <SlicePlaceholder
      title="Chapters"
      message="This chapter list has not been built yet. Assemble it from the list archetype on the styleguide."
    />
  );
}
