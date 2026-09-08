import { describe, expect, it } from "vitest";
import { updatePersonSchema } from "@/lib/schemas/people";

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
