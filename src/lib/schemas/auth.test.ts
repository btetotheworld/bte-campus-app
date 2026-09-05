import { describe, expect, it } from "vitest";
import { forgotPasswordSchema, signInSchema } from "@/lib/schemas/auth";

describe("signInSchema", () => {
  it("accepts an email and password", () => {
    const result = signInSchema.safeParse({
      email: "ada.founder@example.org",
      password: "local-dev-password",
    });
    expect(result.success).toBe(true);
  });

  it("rejects a missing password", () => {
    const result = signInSchema.safeParse({
      email: "ada.founder@example.org",
      password: "",
    });
    expect(result.success).toBe(false);
  });

  it("rejects a malformed email", () => {
    const result = signInSchema.safeParse({
      email: "not-an-email",
      password: "local-dev-password",
    });
    expect(result.success).toBe(false);
  });
});

describe("forgotPasswordSchema", () => {
  it("accepts an email", () => {
    const result = forgotPasswordSchema.safeParse({
      email: "ada.founder@example.org",
    });
    expect(result.success).toBe(true);
  });

  it("rejects a malformed email", () => {
    const result = forgotPasswordSchema.safeParse({ email: "x" });
    expect(result.success).toBe(false);
  });
});
