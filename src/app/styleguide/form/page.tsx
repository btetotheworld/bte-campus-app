import type { Metadata } from "next";
import { PageHeader } from "@/components/bte/page-header";
import { Stepper } from "@/components/bte/stepper";
import { FormField } from "@/components/bte/form-field";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";

export const metadata: Metadata = {
  title: "Form archetype",
};

export default function FormArchetypePage() {
  return (
    <>
      <p className="meta-label mb-2 text-ink-muted">D-004</p>
      <PageHeader
        title="Example application"
        description="Example form. Sign in uses the same field stack without a stepper. Nothing here is submitted."
      />

      <div className="mb-8">
        <Stepper
          steps={[
            { label: "People", state: "done" },
            { label: "Chapter", state: "current" },
            { label: "Review", state: "todo" },
          ]}
        />
      </div>

      <form className="flex max-w-prose flex-col gap-6" action="#">
        <FormField id="institution" label="Institution">
          <Input
            id="institution"
            name="institution"
            defaultValue="University of Lagos"
          />
        </FormField>
        <FormField
          id="fellowship"
          label="Fellowship"
          hint="The campus fellowship that will host the chapter."
        >
          <Input
            id="fellowship"
            name="fellowship"
            defaultValue="Household of Faith Chapel, Akoka"
          />
        </FormField>
        <FormField
          id="notes"
          label="Notes"
          error="Add a sentence so reviewers know why this site."
        >
          <Textarea
            id="notes"
            name="notes"
            aria-invalid
            aria-describedby="notes-error"
          />
        </FormField>
        <div>
          <Button type="button">Continue</Button>
        </div>
      </form>
    </>
  );
}
