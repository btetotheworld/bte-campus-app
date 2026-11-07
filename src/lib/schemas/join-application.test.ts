import { describe, expect, it } from "vitest";
import { joinApplicantSchema } from "./join-application";

const validApplicant = {
  fullName: "Ada Okafor",
  email: "ada@example.org",
  confirmsMinimumAge: true,
  acceptsTerms: true,
};

describe("joinApplicantSchema", () => {
  it("normalizes a valid applicant", () => {
    expect(
      joinApplicantSchema.parse({
        ...validApplicant,
        fullName: "  Ada Okafor  ",
        email: "  ADA@EXAMPLE.ORG ",
      })
    ).toEqual(validApplicant);
  });

  it("requires the minimum-age and privacy confirmations", () => {
    expect(
      joinApplicantSchema.safeParse({
        ...validApplicant,
        confirmsMinimumAge: false,
      }).success
    ).toBe(false);
    expect(
      joinApplicantSchema.safeParse({
        ...validApplicant,
        acceptsTerms: false,
      }).success
    ).toBe(false);
  });

  it("rejects extra fields and invalid identity details", () => {
    expect(
      joinApplicantSchema.safeParse({
        ...validApplicant,
        email: "not-an-email",
        role: "founder",
      }).success
    ).toBe(false);
  });
});
