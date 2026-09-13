"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import {
  approveJoinApplication,
  declineJoinApplication,
} from "@/lib/actions/people";
import type { membership_role } from "@/lib/db/types";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";

const roles: { value: membership_role; label: string }[] = [
  { value: "coordinator", label: "Coordinator" },
  { value: "campus_lead", label: "Campus lead" },
  { value: "assistant_lead", label: "Assistant lead" },
  { value: "practitioner", label: "Practitioner" },
  { value: "member", label: "Member" },
];

type Application = {
  id: string;
  person: { full_name: string; email: string };
  departmentId: string | null;
};

type Department = { id: string; name: string };

export function ApprovalQueue({
  applications,
  departments,
}: {
  applications: Application[];
  departments: Department[];
}) {
  const router = useRouter();
  const [pendingId, setPendingId] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);

  async function approve(application: Application, form: HTMLFormElement) {
    const formData = new FormData(form);
    setPendingId(application.id);
    setError(null);
    const result = await approveJoinApplication({
      applicationId: application.id,
      departmentId: String(formData.get("department_id") ?? ""),
      role: String(formData.get("role") ?? ""),
    });
    setPendingId(null);
    if (!result.ok) {
      setError(result.error);
      return;
    }
    router.refresh();
  }

  async function decline(applicationId: string) {
    setPendingId(applicationId);
    setError(null);
    const result = await declineJoinApplication({ applicationId });
    setPendingId(null);
    if (!result.ok) {
      setError(result.error);
      return;
    }
    router.refresh();
  }

  return (
    <section
      aria-labelledby="approval-queue-title"
      className="flex flex-col gap-4"
    >
      <div>
        <h2 id="approval-queue-title" className="text-h2">
          Pending applications
        </h2>
        <p className="mt-1 text-body text-ink-secondary">
          Approve a person into the team or keep their record inactive.
        </p>
      </div>

      {error ? (
        <Alert variant="destructive">
          <AlertTitle>The application was not updated</AlertTitle>
          <AlertDescription>{error}</AlertDescription>
        </Alert>
      ) : null}

      {applications.map((application) => (
        <Card key={application.id}>
          <CardHeader>
            <div>
              <CardTitle>{application.person.full_name}</CardTitle>
              <CardDescription>{application.person.email}</CardDescription>
            </div>
          </CardHeader>
          <CardContent>
            {departments.length === 0 ? (
              <p className="text-body text-ink-secondary">
                Add a department before approving this person.
              </p>
            ) : (
              <form
                className="flex flex-col gap-4"
                onSubmit={(event) => {
                  event.preventDefault();
                  void approve(application, event.currentTarget);
                }}
              >
                <label
                  className="flex flex-col gap-2 text-sm font-semibold"
                  htmlFor={`department-${application.id}`}
                >
                  Department
                  <select
                    id={`department-${application.id}`}
                    name="department_id"
                    defaultValue={application.departmentId ?? departments[0].id}
                    className="h-(--control-height) rounded border border-border bg-bg px-3 text-sm font-normal text-ink outline-none focus-visible:ring-2 focus-visible:ring-navy"
                    disabled={pendingId === application.id}
                  >
                    {departments.map((department) => (
                      <option key={department.id} value={department.id}>
                        {department.name}
                      </option>
                    ))}
                  </select>
                </label>
                <label
                  className="flex flex-col gap-2 text-sm font-semibold"
                  htmlFor={`role-${application.id}`}
                >
                  Membership role
                  <select
                    id={`role-${application.id}`}
                    name="role"
                    defaultValue="member"
                    className="h-(--control-height) rounded border border-border bg-bg px-3 text-sm font-normal text-ink outline-none focus-visible:ring-2 focus-visible:ring-navy"
                    disabled={pendingId === application.id}
                  >
                    {roles.map((role) => (
                      <option key={role.value} value={role.value}>
                        {role.label}
                      </option>
                    ))}
                  </select>
                </label>
                <div className="flex flex-wrap gap-3">
                  <Button type="submit" loading={pendingId === application.id}>
                    Approve application
                  </Button>
                  <Button
                    type="button"
                    variant="destructive"
                    loading={pendingId === application.id}
                    onClick={() => void decline(application.id)}
                  >
                    Decline application
                  </Button>
                </div>
              </form>
            )}
          </CardContent>
        </Card>
      ))}
    </section>
  );
}
