import { z } from "zod";
import { personRecordIdSchema } from "@/lib/schemas/edit-person-record";

export const verifyPersonSchema = z.strictObject({
  personId: personRecordIdSchema,
});

export type VerifyPersonInput = z.infer<typeof verifyPersonSchema>;

export const updatePersonSchema = z
  .object({
    full_name: z.string().trim().min(1, "Enter your full name"),
    phone: z.string().trim().nullable(),
    graduation_year: z.number().int().nullable(),
    year_group: z.number().int().nullable(),
  })
  .strict();

export type UpdatePersonInput = z.infer<typeof updatePersonSchema>;
