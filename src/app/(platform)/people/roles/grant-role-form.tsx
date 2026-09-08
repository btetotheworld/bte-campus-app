"use client";

import { useState, type FormEvent } from "react";
import { useRouter } from "next/navigation";
import { grantPlatformRole } from "@/lib/actions/platform-roles";
import { GRANTABLE_PLATFORM_ROLES } from "@/lib/schemas/platform-roles";
import { FormField } from "@/components/bte/form-field";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { Button } from "@/components/ui/button";
import { SearchableSelect } from "@/app/(platform)/people/roles/searchable-select";

const ROLE_LABELS: Record<(typeof GRANTABLE_PLATFORM_ROLES)[number], string> = {
  people_manager: "People manager",
  program_coordinator: "Program coordinator",
  showcase_owner: "Showcase owner",
  reviewer: "Reviewer",
  auditor: "Auditor",
};

const ROLE_OPTIONS = GRANTABLE_PLATFORM_ROLES.map((role) => ({
  value: role,
  label: ROLE_LABELS[role],
}));

export function GrantRoleForm({
  people,
}: {
  people: { id: string; full_name: string }[];
}) {
  const router = useRouter();
  const [error, setError] = useState<string | null>(null);
  const [pending, setPending] = useState(false);
  const [formKey, setFormKey] = useState(0);

  async function onSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setError(null);
    setPending(true);
    const form = event.currentTarget;
    const data = new FormData(form);
    const result = await grantPlatformRole({
      personId: String(data.get("personId") ?? ""),
      role: String(data.get("role") ?? ""),
    });
    setPending(false);
    if (!result.ok) {
      setError(result.error);
      return;
    }
    setFormKey((key) => key + 1);
    router.refresh();
  }

  return (
    <form
      key={formKey}
      onSubmit={onSubmit}
      className="flex max-w-prose flex-col gap-6"
    >
      {error ? (
        <Alert variant="destructive">
          <AlertTitle>The role was not granted</AlertTitle>
          <AlertDescription>{error}</AlertDescription>
        </Alert>
      ) : null}

      <FormField
        id="personId"
        label="Person"
        hint="Type a name to search. The person must already have an account."
      >
        <SearchableSelect
          id="personId"
          name="personId"
          disabled={pending}
          emptyMessage="No person matches that name."
          options={people.map((person) => ({
            value: person.id,
            label: person.full_name,
          }))}
        />
      </FormField>

      <FormField
        id="role"
        label="Role"
        hint="Type to filter the grantable roles."
      >
        <SearchableSelect
          id="role"
          name="role"
          disabled={pending}
          emptyMessage="No role matches that search."
          options={ROLE_OPTIONS}
        />
      </FormField>

      <Button type="submit" loading={pending}>
        Grant role
      </Button>
    </form>
  );
}
