import { describe, expect, it } from "vitest";
import {
  grantPlatformRoleSchema,
  revokePlatformRoleSchema,
} from "@/lib/schemas/platform-roles";

describe("grantPlatformRoleSchema", () => {
  it("accepts a grantable role", () => {
    const parsed = grantPlatformRoleSchema.safeParse({
      personId: "11111111-1111-1111-1111-100000000002",
      role: "people_manager",
    });
    expect(parsed.success).toBe(true);
  });

  it("rejects granting founder", () => {
    const parsed = grantPlatformRoleSchema.safeParse({
      personId: "11111111-1111-1111-1111-100000000002",
      role: "founder",
    });
    expect(parsed.success).toBe(false);
  });

  it("rejects a missing person", () => {
    const parsed = grantPlatformRoleSchema.safeParse({
      personId: "",
      role: "reviewer",
    });
    expect(parsed.success).toBe(false);
  });
});

describe("revokePlatformRoleSchema", () => {
  it("accepts an assignment id", () => {
    const parsed = revokePlatformRoleSchema.safeParse({
      assignmentId: "aaaaaaaa-0000-0000-0000-000000000001",
    });
    expect(parsed.success).toBe(true);
  });

  it("rejects a blank assignment", () => {
    const parsed = revokePlatformRoleSchema.safeParse({ assignmentId: "" });
    expect(parsed.success).toBe(false);
  });
});
