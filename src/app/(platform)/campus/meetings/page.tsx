import type { Metadata } from "next";
import { GatedPlaceholder } from "@/app/(platform)/module-gate";

export const metadata: Metadata = { title: "Meetings" };

export default function MeetingsPage() {
  return (
    <GatedPlaceholder
      title="Meetings"
      module="meetings"
      operation="read"
      message="This meeting list has not been built yet. Assemble it from the list archetype on the styleguide."
    />
  );
}
