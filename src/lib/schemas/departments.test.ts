import { describe, expect, it } from "vitest";
import { createDepartmentSchema } from "./departments";

describe("createDepartmentSchema", () => {
  it.each(["team", "campus_chapter"])(
    "accepts a named %s department",
    (kind) => {
      expect(
        createDepartmentSchema.parse({ name: "  Example department  ", kind })
      ).toEqual({ name: "Example department", kind });
    }
  );
  it.each(["", "   "])("rejects a blank name", (name) => {
    expect(
      createDepartmentSchema.safeParse({ name, kind: "team" }).success
    ).toBe(false);
  });
  it("rejects invalid kinds and missing names", () => {
    expect(
      createDepartmentSchema.safeParse({ name: "Example", kind: "admin" })
        .success
    ).toBe(false);
    expect(createDepartmentSchema.safeParse({ kind: "team" }).success).toBe(
      false
    );
  });
  it("rejects attempts to set server-controlled fields", () => {
    expect(
      createDepartmentSchema.safeParse({
        name: "Example",
        kind: "team",
        archived_at: "2026-09-01",
        id: "injected",
      }).success
    ).toBe(false);
  });
});
