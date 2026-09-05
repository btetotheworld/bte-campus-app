import type { Metadata } from "next";
import { SlicePlaceholder } from "@/app/(platform)/slice-placeholder";

export const metadata: Metadata = { title: "Meetings" };

export default function MeetingsPage() {
  return (
    <SlicePlaceholder
      title="Meetings"
      message="This meeting list has not been built yet. Assemble it from the list archetype on the styleguide."
    />
  );
}
