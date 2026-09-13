import { z } from "zod";

const UUID = /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i;

export const approveJoinApplicationSchema = z
  .object({
    applicationId: z.string().regex(UUID, "Choose an application"),
    departmentId: z.string().regex(UUID, "Choose a department"),
    role: z.enum([
      "coordinator",
      "campus_lead",
      "assistant_lead",
      "practitioner",
      "member",
    ]),
  })
  .strict();

export const declineJoinApplicationSchema = z
  .object({
    applicationId: z.string().regex(UUID, "Choose an application"),
  })
  .strict();

export type ApproveJoinApplicationInput = z.infer<
  typeof approveJoinApplicationSchema
>;
export type DeclineJoinApplicationInput = z.infer<
  typeof declineJoinApplicationSchema
>;
export const updatePersonSchema = z
  .object({
    full_name: z.string().trim().min(1, "Enter your full name"),
    phone: z.string().trim().nullable(),
    graduation_year: z.number().int().nullable(),
    year_group: z.number().int().nullable(),
  })
  .strict();

export type UpdatePersonInput = z.infer<typeof updatePersonSchema>;
