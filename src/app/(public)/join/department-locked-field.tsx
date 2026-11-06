import { FormField } from "@/components/bte/form-field";
import { Input } from "@/components/ui/input";

export function DepartmentLockedField({
  departmentId,
  departmentName,
}: {
  departmentId: string;
  departmentName: string;
}) {
  return (
    <FormField
      id="department"
      label="Department"
      hint="This application is for this department. You cannot change it."
    >
      <Input
        id="department"
        value={departmentName}
        readOnly
        aria-readonly="true"
      />
      <input type="hidden" name="departmentId" value={departmentId} />
    </FormField>
  );
}
