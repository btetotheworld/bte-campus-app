import type { Metadata } from "next";
import { SlicePlaceholder } from "@/app/(platform)/slice-placeholder";

export const metadata: Metadata = { title: "People" };

export default function PeoplePage() {
  return (
    <SlicePlaceholder
      title="People"
      message="This people list has not been built yet. Sprint 2 owns it."
    />
  );
}
