"use client";

import { useRef, useState, type FormEvent } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { FormField } from "@/components/bte/form-field";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { createDepartmentSchema } from "@/lib/schemas/departments";
import { createDepartment } from "../actions";

export function DepartmentForm() {
  const router = useRouter();
  const nameRef = useRef<HTMLInputElement>(null);
  const [kind, setKind] = useState("team");
  const [nameError, setNameError] = useState<string>();
  const [error, setError] = useState<string>();
  const [pending, setPending] = useState(false);
  const submitting = useRef(false);

  async function onSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    if (submitting.current) return;
    setError(undefined);
    setNameError(undefined);
    const parsed = createDepartmentSchema.safeParse({
      name: nameRef.current?.value ?? "",
      kind,
    });
    if (!parsed.success) {
      setNameError(parsed.error.issues[0]?.message);
      nameRef.current?.focus();
      return;
    }
    submitting.current = true;
    setPending(true);
    try {
      const result = await createDepartment(parsed.data);
      if (!result.ok) {
        setError(result.error);
        return;
      }
      router.push(`/departments/${result.data.id}`);
      router.refresh();
    } catch {
      setError(
        "The request could not be completed. Check the department list before trying again."
      );
    } finally {
      submitting.current = false;
      setPending(false);
    }
  }

  return (
    <form
      onSubmit={onSubmit}
      noValidate
      className="flex max-w-prose flex-col gap-6"
    >
      {error ? (
        <Alert variant="destructive">
          <AlertTitle>The department was not confirmed</AlertTitle>
          <AlertDescription>{error}</AlertDescription>
        </Alert>
      ) : null}
      <FormField id="name" label="Department name" error={nameError}>
        <Input
          ref={nameRef}
          id="name"
          name="name"
          required
          disabled={pending}
          className="focus-visible:outline-solid"
          aria-invalid={!!nameError}
          aria-describedby={nameError ? "name-error" : undefined}
        />
      </FormField>
      <FormField id="kind" label="Department kind">
        <Select value={kind} onValueChange={setKind} disabled={pending}>
          <SelectTrigger
            id="kind"
            className="w-full focus-visible:outline-solid"
          >
            <SelectValue />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="team">Team</SelectItem>
            <SelectItem value="campus_chapter">Campus chapter</SelectItem>
          </SelectContent>
        </Select>
      </FormField>
      <div className="flex items-center gap-4">
        <Button
          type="submit"
          loading={pending}
          size="touch"
          className="focus-visible:outline-solid"
        >
          Create department
        </Button>
        <Link href="/departments" className="text-sm text-navy underline">
          Cancel
        </Link>
      </div>
    </form>
  );
}
