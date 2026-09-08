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
