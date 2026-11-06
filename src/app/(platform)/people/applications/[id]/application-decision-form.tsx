"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { FormField } from "@/components/bte/form-field";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { Button } from "@/components/ui/button";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  approveJoinApplication,
  declineJoinApplication,
} from "@/lib/actions/people";
import type { membership_role } from "@/lib/db/types";

const roles: { value: membership_role; label: string }[] = [
  { value: "coordinator", label: "Coordinator" },
  { value: "campus_lead", label: "Campus lead" },
  { value: "assistant_lead", label: "Assistant lead" },
  { value: "practitioner", label: "Practitioner" },
  { value: "member", label: "Member" },
];

export function ApplicationDecisionForm({
  applicationId,
  departmentId,
  departments,
}: {
  applicationId: string;
  departmentId: string | null;
  departments: { id: string; name: string }[];
}) {
  const router = useRouter();
  const [selectedDepartment, setSelectedDepartment] = useState(
    departmentId ?? departments[0]?.id ?? ""
  );
  const [role, setRole] = useState<membership_role>("member");
  const [pending, setPending] = useState<"approve" | "reject" | null>(null);
  const [error, setError] = useState<string | null>(null);

  async function approve() {
    setPending("approve");
    setError(null);
    const result = await approveJoinApplication({
      applicationId,
      departmentId: selectedDepartment,
      role,
    });
    if (!result.ok) {
      setError(result.error);
      setPending(null);
      return;
    }
    router.push("/people/applications");
    router.refresh();
  }

  async function reject() {
    setPending("reject");
    setError(null);
    const result = await declineJoinApplication({ applicationId });
    if (!result.ok) {
      setError(result.error);
      setPending(null);
      return;
    }
    router.push("/people/applications");
    router.refresh();
  }

  if (!departments.length) {
    return (
      <div className="flex flex-col items-start gap-4">
        {error ? (
          <Alert variant="destructive">
            <AlertTitle>The application was not updated</AlertTitle>
            <AlertDescription>{error}</AlertDescription>
          </Alert>
        ) : null}
        <p className="text-body text-ink-secondary">
          Add an active department before approving this application. You can
          still reject it.
        </p>
        <Button
          type="button"
          variant="destructive"
          loading={pending === "reject"}
          disabled={pending !== null}
          onClick={() => void reject()}
        >
          Reject application
        </Button>
      </div>
    );
  }

  return (
    <div className="flex max-w-prose flex-col gap-6">
      {error ? (
        <Alert variant="destructive">
          <AlertTitle>The application was not updated</AlertTitle>
          <AlertDescription>{error}</AlertDescription>
        </Alert>
      ) : null}
      <FormField id="department" label="Department">
        <Select
          value={selectedDepartment}
          onValueChange={setSelectedDepartment}
          disabled={pending !== null}
        >
          <SelectTrigger id="department" className="w-full">
            <SelectValue />
          </SelectTrigger>
          <SelectContent>
            {departments.map((department) => (
              <SelectItem key={department.id} value={department.id}>
                {department.name}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </FormField>
      <FormField id="membership-role" label="Membership role">
        <Select
          value={role}
          onValueChange={(value) => setRole(value as membership_role)}
          disabled={pending !== null}
        >
          <SelectTrigger id="membership-role" className="w-full">
            <SelectValue />
          </SelectTrigger>
          <SelectContent>
            {roles.map((item) => (
              <SelectItem key={item.value} value={item.value}>
                {item.label}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </FormField>
      <div className="flex flex-wrap gap-3">
        <Button
          type="button"
          loading={pending === "approve"}
          disabled={pending !== null}
          onClick={() => void approve()}
        >
          Approve application
        </Button>
        <Button
          type="button"
          variant="destructive"
          loading={pending === "reject"}
          disabled={pending !== null}
          onClick={() => void reject()}
        >
          Reject application
        </Button>
      </div>
    </div>
  );
}
