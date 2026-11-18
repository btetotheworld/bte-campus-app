import { z } from "zod";

export const joinApplicantSchema = z
  .object({
    fullName: z
      .string()
      .trim()
      .min(2, "Enter your full name")
      .max(120, "Enter a name with 120 characters or fewer"),
    email: z
      .string()
      .trim()
      .toLowerCase()
      .email("Enter a valid email address")
      .max(254, "Enter an email address with 254 characters or fewer"),
    confirmsMinimumAge: z.literal(true, {
      error: "Confirm that you are at least 18 years old",
    }),
    acceptsTerms: z.literal(true, {
      error: "Accept the terms and privacy notice to continue",
    }),
  })
  .strict();

export type JoinApplicantInput = z.infer<typeof joinApplicantSchema>;
