"use client";

import { useState, useTransition, type FormEvent } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { FormField } from "@/components/bte/form-field";
import { Input } from "@/components/ui/input";
import { Button, buttonVariants } from "@/components/ui/button";
import { Alert } from "@/components/ui/alert";
import { editPersonRecordSchema } from "@/lib/schemas/edit-person-record";
import { editPersonRecord } from "../../actions";
import type { Database } from "@/lib/db/types";

type Fields = "full_name" | "phone";
type EditablePerson = Pick<
  Database["public"]["Tables"]["people"]["Row"],
  "id" | Fields
>;
const fields = [
  { name: "full_name", label: "Full name", type: "text" },
  { name: "phone", label: "Phone", type: "tel" },
] as const;

export function PersonRecordForm({ person }: { person: EditablePerson }) {
  const router = useRouter();
  const [pending, startTransition] = useTransition();
  const [error, setError] = useState<string | null>(null);
  const [errors, setErrors] = useState<Partial<Record<Fields, string>>>({});

  function submit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    const form = event.currentTarget;
    const data = new FormData(form);
    const result = editPersonRecordSchema.safeParse({
      id: person.id,
      full_name: data.get("full_name"),
      phone: data.get("phone"),
    });
    setError(null);
    if (!result.success) {
      const fieldErrors: Partial<Record<Fields, string>> = {};
      for (const field of fields) {
        const issue = result.error.issues.find(
          (issue) => issue.path[0] === field.name
        );
        if (issue) fieldErrors[field.name] = issue.message;
      }
      setErrors(fieldErrors);
      const first = fields.find((field) => fieldErrors[field.name]);
      if (first)
        (
          form.elements.namedItem(first.name) as HTMLInputElement | null
        )?.focus();
      return;
    }
    setErrors({});
    startTransition(async () => {
      try {
        const saved = await editPersonRecord(result.data);
        if (!saved.ok) {
          setError(saved.error);
          return;
        }
        router.push(`/people/records/${person.id}`);
        router.refresh();
      } catch {
        setError(
          "The save request could not be completed. Refresh the record before trying again."
        );
      }
    });
  }

  return (
    <form onSubmit={submit} noValidate className="flex max-w-lg flex-col gap-6">
      {error ? <Alert variant="destructive">{error}</Alert> : null}
      {fields.map((field) => (
        <FormField
          key={field.name}
          id={field.name}
          label={field.label}
          error={errors[field.name]}
        >
          <Input
            id={field.name}
            name={field.name}
            type={field.type}
            defaultValue={person[field.name] ?? ""}
            disabled={pending}
            required={field.name === "full_name"}
            aria-invalid={Boolean(errors[field.name])}
            aria-describedby={
              errors[field.name] ? `${field.name}-error` : undefined
            }
            className="h-(--control-height-touch) focus-visible:outline-solid"
          />
        </FormField>
      ))}
      <div className="flex flex-wrap gap-3">
        <Button
          type="submit"
          size="touch"
          loading={pending}
          className="focus-visible:outline-solid"
        >
          {pending ? "Saving person record" : "Save person record"}
        </Button>
        {pending ? (
          <Button variant="ghost" size="touch" disabled>
            Cancel
          </Button>
        ) : (
          <Link
            href={`/people/records/${person.id}`}
            className={buttonVariants({
              variant: "ghost",
              size: "touch",
              className: "focus-visible:outline-solid",
            })}
          >
            Cancel
          </Link>
        )}
      </div>
    </form>
  );
}
