import type { Metadata } from "next";
import { GatedPlaceholder } from "@/app/(platform)/module-gate";

export const metadata: Metadata = { title: "Members" };

export default function MembersPage() {
  return (
    <GatedPlaceholder
      title="Members"
      module="chapter_members"
      operation="read"
      message="This member roster has not been built yet. Assemble it from the list archetype on the styleguide."
    />
  );
}
