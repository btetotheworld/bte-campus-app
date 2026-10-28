import { describe, expect, it } from "vitest";
import { archiveDepartmentSchema } from "./archive-department";

describe("archiveDepartmentSchema", () => {
  const id = "aaaaaaaa-0000-0000-0000-000000000001";
  it("accepts existing seed and generated UUIDs", () => {
    expect(archiveDepartmentSchema.safeParse({ id }).success).toBe(true);
    expect(
      archiveDepartmentSchema.safeParse({
        id: "550e8400-e29b-41d4-a716-446655440000",
      }).success
    ).toBe(true);
  });
  it.each([
    {},
    { id: "invalid" },
    { id: `${id}/extra` },
    { id, archived_at: null },
  ])(
    "rejects malformed IDs and client-controlled archive fields: %j",
    (input) => {
      expect(archiveDepartmentSchema.safeParse(input).success).toBe(false);
    }
  );
});
