import { describe, expect, it } from "vitest";
import {
  approveJoinApplicationSchema,
  declineJoinApplicationSchema,
  updatePersonSchema,
} from "@/lib/schemas/people";

const applicationId = "11111111-1111-1111-1111-100000000001";
const departmentId = "11111111-1111-1111-1111-100000000002";

describe("join application schemas", () => {
  it("accepts approval details", () => {
    expect(
      approveJoinApplicationSchema.safeParse({
        applicationId,
        departmentId,
        role: "campus_lead",
      }).success
    ).toBe(true);
  });

  it("rejects approval fields outside the write contract", () => {
    expect(
      approveJoinApplicationSchema.safeParse({
        applicationId,
        departmentId,
        role: "campus_lead",
        status: "approved",
      }).success
    ).toBe(false);
  });

  it("accepts a decline request", () => {
    expect(
      declineJoinApplicationSchema.safeParse({ applicationId }).success
    ).toBe(true);
  });
});

describe("updatePersonSchema", () => {
  it("accepts the editable profile fields", () => {
    const result = updatePersonSchema.safeParse({
      full_name: "Ada Okafor",
      phone: "+234 800 000 0000",
      graduation_year: 2024,
      year_group: 4,
    });

    expect(result.success).toBe(true);
  });

  it("accepts empty optional profile fields as null", () => {
    const result = updatePersonSchema.safeParse({
      full_name: "Ada Okafor",
      phone: null,
      graduation_year: null,
      year_group: null,
    });

    expect(result.success).toBe(true);
  });

  it("rejects fields outside self-service editing", () => {
    const result = updatePersonSchema.safeParse({
      full_name: "Ada Okafor",
      phone: null,
      graduation_year: null,
      year_group: null,
      status: "inactive",
    });

    expect(result.success).toBe(false);
  });

  it("rejects a blank name and non-integer years", () => {
    expect(
      updatePersonSchema.safeParse({
        full_name: " ",
        phone: null,
        graduation_year: 2024.5,
        year_group: 4,
      }).success
    ).toBe(false);
  });
});
