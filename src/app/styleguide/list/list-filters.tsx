"use client";

import { useState } from "react";
import { Chip } from "@/components/bte/chip";
import { SegmentedControl } from "@/components/bte/segmented-control";

export function ListFilters() {
  const [status, setStatus] = useState("all");
  const [ownOnly, setOwnOnly] = useState(false);

  return (
    <div className="mb-6 flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
      <SegmentedControl
        ariaLabel="Chapter status"
        value={status}
        onValueChange={setStatus}
        options={[
          { value: "all", label: "All" },
          { value: "active", label: "Active" },
          { value: "at_risk", label: "At risk" },
        ]}
      />
      <Chip pressed={ownOnly} onPressedChange={setOwnOnly}>
        My chapters only
      </Chip>
    </div>
  );
}
