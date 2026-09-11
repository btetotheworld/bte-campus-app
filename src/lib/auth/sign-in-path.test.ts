import { describe, expect, it } from "vitest";
import { signInHref } from "@/lib/auth/sign-in-path";

describe("signInHref", () => {
  it("keeps a same-origin path on next", () => {
    expect(signInHref("/campus/chapters")).toBe(
      "/sign-in?next=%2Fcampus%2Fchapters"
    );
  });

  it("falls back to home when the path is missing", () => {
    expect(signInHref("")).toBe("/sign-in?next=%2F");
  });

  it("rejects a protocol-relative path", () => {
    expect(signInHref("//evil.example")).toBe("/sign-in?next=%2F");
  });
});
