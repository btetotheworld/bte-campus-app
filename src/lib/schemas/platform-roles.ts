import { z } from "zod";

export const GRANTABLE_PLATFORM_ROLES = [
  "people_manager",
  "program_coordinator",
  "showcase_owner",
  "reviewer",
  "auditor",
] as const;

const PERSON_ID =
  /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i;

export const grantPlatformRoleSchema = z.object({
  personId: z.string().regex(PERSON_ID, "Choose a person"),
  role: z.enum(GRANTABLE_PLATFORM_ROLES, {
    error: "Choose a role below founder",
  }),
});

export const revokePlatformRoleSchema = z.object({
  assignmentId: z.string().regex(PERSON_ID, "Choose a role assignment"),
});

export type GrantPlatformRoleInput = z.infer<typeof grantPlatformRoleSchema>;
export type RevokePlatformRoleInput = z.infer<typeof revokePlatformRoleSchema>;
