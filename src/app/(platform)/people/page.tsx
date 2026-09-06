import type { Metadata } from "next";
import { GatedPlaceholder } from "@/app/(platform)/module-gate";

export const metadata: Metadata = { title: "People" };

export default function PeoplePage() {
  return (
    <GatedPlaceholder
      title="People"
      module="people"
      operation="read"
      message="This people list has not been built yet. Sprint 2 owns it."
    />
  );
}
