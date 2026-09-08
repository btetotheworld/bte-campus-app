import { z } from "zod";

export const updatePersonSchema = z
  .object({
    full_name: z.string().trim().min(1, "Enter your full name"),
    phone: z.string().trim().nullable(),
    graduation_year: z.number().int().nullable(),
    year_group: z.number().int().nullable(),
  })
  .strict();

export type UpdatePersonInput = z.infer<typeof updatePersonSchema>;
