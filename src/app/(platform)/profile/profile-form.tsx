"use client";

import { useState, type FormEvent } from "react";
import { updateOwnProfile } from "@/lib/actions/people";
import { FormField } from "@/components/bte/form-field";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";

type ProfilePerson = {
  full_name: string;
  email: string;
  phone: string | null;
  graduation_year: number | null;
  year_group: number | null;
};

export function ProfileForm({ person }: { person: ProfilePerson }) {
  const [pending, setPending] = useState(false);
  const [message, setMessage] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);

  async function onSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setPending(true);
    setMessage(null);
    setError(null);

    const form = new FormData(event.currentTarget);
    const graduationYear = String(form.get("graduation_year") ?? "");
    const yearGroup = String(form.get("year_group") ?? "");
    const result = await updateOwnProfile({
      full_name: String(form.get("full_name") ?? ""),
      phone: String(form.get("phone") ?? "").trim() || null,
      graduation_year: graduationYear ? Number(graduationYear) : null,
      year_group: yearGroup ? Number(yearGroup) : null,
    });

    setPending(false);
    if (!result.ok) {
      setError(result.error);
      return;
    }
    setMessage("Your profile was saved.");
  }

  return (
    <form onSubmit={onSubmit} className="flex flex-col gap-6">
      {error ? (
        <Alert variant="destructive">
          <AlertTitle>Your profile was not saved</AlertTitle>
          <AlertDescription>{error}</AlertDescription>
        </Alert>
      ) : null}
      {message ? (
        <Alert>
          <AlertTitle>Profile saved</AlertTitle>
          <AlertDescription>{message}</AlertDescription>
        </Alert>
      ) : null}

      <FormField id="full_name" label="Full name">
        <Input
          id="full_name"
          name="full_name"
          defaultValue={person.full_name}
          autoComplete="name"
          required
          disabled={pending}
        />
      </FormField>

      <FormField
        id="email"
        label="Email"
        hint="Email changes are managed through account recovery."
      >
        <Input
          id="email"
          name="email"
          type="email"
          value={person.email}
          readOnly
          aria-readonly="true"
        />
      </FormField>

      <FormField id="phone" label="Phone">
        <Input
          id="phone"
          name="phone"
          type="tel"
          defaultValue={person.phone ?? ""}
          autoComplete="tel"
          disabled={pending}
        />
      </FormField>

      <FormField id="graduation_year" label="Graduation year">
        <Input
          id="graduation_year"
          name="graduation_year"
          type="number"
          min="1900"
          max="2100"
          defaultValue={person.graduation_year ?? ""}
          inputMode="numeric"
          disabled={pending}
        />
      </FormField>

      <FormField id="year_group" label="Year group">
        <Input
          id="year_group"
          name="year_group"
          type="number"
          min="1"
          defaultValue={person.year_group ?? ""}
          inputMode="numeric"
          disabled={pending}
        />
      </FormField>

      <Button type="submit" loading={pending}>
        Save profile
      </Button>
    </form>
  );
}
