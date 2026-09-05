import { beforeEach, describe, expect, it, vi } from "vitest";

const signInWithPassword = vi.fn();
const getUser = vi.fn();
const signOutMock = vi.fn();
const resetPasswordForEmail = vi.fn();
const maybeSingle = vi.fn();
const eq = vi.fn(() => ({ maybeSingle }));
const select = vi.fn(() => ({ eq }));
const from = vi.fn(() => ({ select }));

vi.mock("@/lib/supabase/server", () => ({
  createClient: vi.fn(async () => ({
    auth: {
      signInWithPassword,
      getUser,
      signOut: signOutMock,
      resetPasswordForEmail,
    },
    from,
  })),
}));

vi.mock("next/navigation", () => ({
  redirect: vi.fn((path: string) => {
    throw new Error(`redirect:${path}`);
  }),
}));

import { requestPasswordReset, signIn, signOut } from "@/lib/actions/auth";

describe("signIn", () => {
  beforeEach(() => {
    signInWithPassword.mockReset();
    getUser.mockReset();
    signOutMock.mockReset();
    maybeSingle.mockReset();
    from.mockClear();
  });

  it("rejects invalid input before calling supabase", async () => {
    const result = await signIn({ email: "nope", password: "x" });
    expect(result.ok).toBe(false);
    expect(signInWithPassword).not.toHaveBeenCalled();
  });

  it("hides supabase auth errors", async () => {
    signInWithPassword.mockResolvedValue({ error: { message: "Invalid" } });
    const result = await signIn({
      email: "ada.founder@example.org",
      password: "wrong",
    });
    expect(result).toEqual({
      ok: false,
      error: "That email or password is wrong.",
    });
  });

  it("signs out an inactive person", async () => {
    signInWithPassword.mockResolvedValue({ error: null });
    getUser.mockResolvedValue({
      data: { user: { id: "11111111-1111-1111-1111-100000000001" } },
    });
    maybeSingle.mockResolvedValue({
      data: { id: "11111111-1111-1111-1111-100000000001", status: "inactive" },
    });
    const result = await signIn({
      email: "ada.founder@example.org",
      password: "local-dev-password",
    });
    expect(signOutMock).toHaveBeenCalled();
    expect(result.ok).toBe(false);
    if (!result.ok) {
      expect(result.error).toMatch(/inactive/);
    }
  });

  it("returns ok when the person is active", async () => {
    signInWithPassword.mockResolvedValue({ error: null });
    getUser.mockResolvedValue({
      data: { user: { id: "11111111-1111-1111-1111-100000000001" } },
    });
    maybeSingle.mockResolvedValue({
      data: { id: "11111111-1111-1111-1111-100000000001", status: "verified" },
    });
    const result = await signIn({
      email: "ada.founder@example.org",
      password: "local-dev-password",
    });
    expect(result).toEqual({ ok: true, data: { ok: true } });
  });
});

describe("signOut", () => {
  it("redirects to sign in after a successful sign out", async () => {
    signOutMock.mockResolvedValue({ error: null });
    await expect(signOut()).rejects.toThrow("redirect:/sign-in");
  });
});

describe("requestPasswordReset", () => {
  beforeEach(() => {
    resetPasswordForEmail.mockReset();
  });

  it("rejects invalid email", async () => {
    const result = await requestPasswordReset({ email: "x" });
    expect(result.ok).toBe(false);
    expect(resetPasswordForEmail).not.toHaveBeenCalled();
  });

  it("asks supabase to send the reset email", async () => {
    resetPasswordForEmail.mockResolvedValue({ error: null });
    const result = await requestPasswordReset({
      email: "ada.founder@example.org",
    });
    expect(result).toEqual({ ok: true, data: { sent: true } });
    expect(resetPasswordForEmail).toHaveBeenCalled();
  });
});
