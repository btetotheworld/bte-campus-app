import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { FormField } from "@/components/bte/form-field";

export function JoinApplicationFields() {
  return (
    <div className="flex max-w-prose flex-col gap-6">
      <Alert>
        <AlertTitle>Account setup is required</AlertTitle>
        <AlertDescription>
          Account setup is currently unavailable. You cannot save or submit an
          application from this page yet.
        </AlertDescription>
      </Alert>
      <FormField id="full-name" label="Full name">
        <Input
          id="full-name"
          name="fullName"
          autoComplete="name"
          disabled
        />
      </FormField>
      <FormField id="email" label="Email address">
        <Input
          id="email"
          name="email"
          type="email"
          autoComplete="email"
          disabled
        />
      </FormField>
      <div className="flex items-start gap-3">
        <Checkbox id="minimum-age" disabled />
        <Label htmlFor="minimum-age" className="text-sm font-normal">
          I confirm that I am at least 18 years old.
        </Label>
      </div>
      <div className="flex items-start gap-3">
        <Checkbox id="terms" disabled />
        <Label htmlFor="terms" className="text-sm font-normal">
          I accept the terms and conditions and have read the privacy notice.
        </Label>
      </div>
      <Button type="button" disabled>
        Save application draft
      </Button>
    </div>
  );
}
