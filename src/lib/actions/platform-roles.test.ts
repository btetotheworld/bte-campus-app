import { beforeEach, describe, expect, it, vi } from "vitest";

const insert = vi.fn();
const eq = vi.fn();
const del = vi.fn(() => ({ eq }));
const from = vi.fn(() => ({ insert, delete: del }));
const getSessionPerson = vi.fn();

vi.mock("@/lib/supabase/server", () => ({
  createClient: vi.fn(async () => ({ from })),
}));

vi.mock("@/lib/auth/session", () => ({
  getSessionPerson: (...args: unknown[]) => getSessionPerson(...args),
}));

import {
  grantPlatformRole,
  revokePlatformRole,
} from "@/lib/actions/platform-roles";

const ADA = "11111111-1111-1111-1111-100000000001";
const EMEKA = "11111111-1111-1111-1111-100000000002";

describe("grantPlatformRole", () => {
  beforeEach(() => {
    insert.mockReset();
    from.mockClear();
    getSessionPerson.mockReset();
    getSessionPerson.mockResolvedValue({
      id: ADA,
      full_name: "Ada Okafor",
      email: "ada.founder@example.org",
      status: "verified",
    });
  });

  it("rejects invalid input before writing", async () => {
    const result = await grantPlatformRole({
      personId: EMEKA,
      role: "founder",
    });
    expect(result.ok).toBe(false);
    expect(insert).not.toHaveBeenCalled();
  });

  it("rejects a self-grant before writing", async () => {
    const result = await grantPlatformRole({
      personId: ADA,
      role: "people_manager",
    });
    expect(result).toEqual({
      ok: false,
      error: "You cannot grant a role to yourself.",
    });
    expect(insert).not.toHaveBeenCalled();
  });

  it("inserts with granted_by set to the actor", async () => {
    insert.mockResolvedValue({ error: null });
    const result = await grantPlatformRole({
      personId: EMEKA,
      role: "people_manager",
    });
    expect(result).toEqual({ ok: true, data: { granted: true } });
    expect(insert).toHaveBeenCalledWith({
      person_id: EMEKA,
      role: "people_manager",
      granted_by: ADA,
    });
  });

  it("maps a database rank rejection", async () => {
    insert.mockResolvedValue({
      error: { message: "Nobody grants a role equal to or above their own" },
    });
    const result = await grantPlatformRole({
      personId: EMEKA,
      role: "people_manager",
    });
    expect(result).toEqual({
      ok: false,
      error: "You cannot grant a role equal to or above your own.",
    });
  });
});

describe("revokePlatformRole", () => {
  beforeEach(() => {
    eq.mockReset();
    del.mockClear();
    from.mockClear();
    getSessionPerson.mockReset();
    getSessionPerson.mockResolvedValue({
      id: ADA,
      full_name: "Ada Okafor",
      email: "ada.founder@example.org",
      status: "verified",
    });
  });

  it("rejects invalid input before writing", async () => {
    const result = await revokePlatformRole({ assignmentId: "nope" });
    expect(result.ok).toBe(false);
    expect(del).not.toHaveBeenCalled();
  });

  it("maps the last founder rejection", async () => {
    eq.mockResolvedValue({
      error: { message: "Removing the last founder is blocked" },
    });
    const result = await revokePlatformRole({
      assignmentId: "aaaaaaaa-0000-0000-0000-000000000001",
    });
    expect(result).toEqual({
      ok: false,
      error: "Removing the last founder is blocked.",
    });
  });
});
