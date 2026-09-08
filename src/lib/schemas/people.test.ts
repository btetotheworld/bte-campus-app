import { describe, expect, it } from "vitest";
import {
  approveJoinApplicationSchema,
  declineJoinApplicationSchema,
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
