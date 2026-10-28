import { describe, expect, it } from "vitest";
import { editPersonRecordSchema } from "./edit-person-record";

const input = {
  id: "aaaaaaaa-0000-0000-0000-000000000001",
  full_name: " Example Person ",
  phone: " ",
};
describe("editPersonRecordSchema", () => {
  it("normalizes names and an empty phone", () => {
    expect(editPersonRecordSchema.parse(input)).toEqual({
      ...input,
      full_name: "Example Person",
      phone: null,
    });
  });
  it.each([
    "status",
    "kind",
    "auth_user_id",
    "email",
    "verified_at",
    "roles",
    "graduation_year",
    "year_group",
  ])("rejects mutation of %s", (field) => {
    expect(
      editPersonRecordSchema.safeParse({ ...input, [field]: "value" }).success
    ).toBe(false);
  });
  it.each([
    { id: "bad" },
    { full_name: " " },
    { graduation_year: 2028.5 },
    { year_group: 2147483648 },
    { phone: 123 },
  ])("rejects invalid input: %j", (fields) => {
    expect(
      editPersonRecordSchema.safeParse({ ...input, ...fields }).success
    ).toBe(false);
  });
});
