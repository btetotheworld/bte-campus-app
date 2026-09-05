import type { Metadata } from "next";
import { SlicePlaceholder } from "@/app/(platform)/slice-placeholder";

export const metadata: Metadata = { title: "Members" };

export default function MembersPage() {
  return (
    <SlicePlaceholder
      title="Members"
      message="This member roster has not been built yet. Assemble it from the list archetype on the styleguide."
    />
  );
}
