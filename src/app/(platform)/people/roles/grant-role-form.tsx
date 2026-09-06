"use client";

import { useState, type FormEvent } from "react";
import { useRouter } from "next/navigation";
import { grantPlatformRole } from "@/lib/actions/platform-roles";
import { GRANTABLE_PLATFORM_ROLES } from "@/lib/schemas/platform-roles";
import { FormField } from "@/components/bte/form-field";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { Button } from "@/components/ui/button";

const ROLE_LABELS: Record<(typeof GRANTABLE_PLATFORM_ROLES)[number], string> = {
  people_manager: "People manager",
  program_coordinator: "Program coordinator",
  showcase_owner: "Showcase owner",
  reviewer: "Reviewer",
  auditor: "Auditor",
};

export function GrantRoleForm({
  people,
}: {
  people: { id: string; full_name: string }[];
}) {
  const router = useRouter();
  const [error, setError] = useState<string | null>(null);
  const [pending, setPending] = useState(false);

  async function onSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setError(null);
    setPending(true);
    const form = new FormData(event.currentTarget);
    const result = await grantPlatformRole({
      personId: String(form.get("personId") ?? ""),
      role: String(form.get("role") ?? ""),
    });
    setPending(false);
    if (!result.ok) {
      setError(result.error);
      return;
    }
    event.currentTarget.reset();
    router.refresh();
  }

  return (
    <form onSubmit={onSubmit} className="flex max-w-prose flex-col gap-6">
      {error ? (
        <Alert variant="destructive">
          <AlertTitle>The role was not granted</AlertTitle>
          <AlertDescription>{error}</AlertDescription>
        </Alert>
      ) : null}

      <FormField
        id="personId"
        label="Person"
        hint="The person must already have an account."
      >
        <select
          id="personId"
          name="personId"
          required
          className="h-(--control-height) w-full rounded border border-border bg-bg px-3 text-sm text-ink outline-none disabled:cursor-not-allowed disabled:opacity-50"
          disabled={pending}
        >
          <option value="">Choose a person</option>
          {people.map((person) => (
            <option key={person.id} value={person.id}>
              {person.full_name}
            </option>
          ))}
        </select>
      </FormField>

      <FormField id="role" label="Role">
        <select
          id="role"
          name="role"
          required
          className="h-(--control-height) w-full rounded border border-border bg-bg px-3 text-sm text-ink outline-none disabled:cursor-not-allowed disabled:opacity-50"
          disabled={pending}
        >
          <option value="">Choose a role</option>
          {GRANTABLE_PLATFORM_ROLES.map((role) => (
            <option key={role} value={role}>
              {ROLE_LABELS[role]}
            </option>
          ))}
        </select>
      </FormField>

      <Button type="submit" loading={pending}>
        Grant role
      </Button>
    </form>
  );
}
