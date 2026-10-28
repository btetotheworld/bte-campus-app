import { z } from "zod";

export const personRecordIdSchema = z
  .string()
  .regex(
    /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i,
    "Choose a valid person record and try again."
  );

export const editPersonRecordSchema = z.strictObject({
  id: personRecordIdSchema,
  full_name: z.string().trim().min(1, "Enter the person's full name."),
  phone: z
    .string()
    .trim()
    .transform((value) => value || null)
    .nullable(),
});
