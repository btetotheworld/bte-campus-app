import { beforeEach, describe, expect, it, vi } from "vitest";

const getUser = vi.fn();
const maybeSingle = vi.fn();
const updateEq = vi.fn();
const selectEq = vi.fn(() => ({ maybeSingle }));
const select = vi.fn(() => ({ eq: selectEq }));
const update = vi.fn(() => ({ eq: updateEq }));
const from = vi.fn(() => ({ select, update }));
const rpc = vi.fn();
const getSessionPerson = vi.fn();
const loadPlatformAccess = vi.fn();

vi.mock("@/lib/supabase/server", () => ({
  createClient: vi.fn(async () => ({
    auth: { getUser },
    from,
    rpc,
  })),
}));

vi.mock("@/lib/auth/session", () => ({
  getSessionPerson: (...args: unknown[]) => getSessionPerson(...args),
}));

vi.mock("@/lib/auth/permissions", () => ({
  loadPlatformAccess: (...args: unknown[]) => loadPlatformAccess(...args),
}));

vi.mock("next/cache", () => ({
  revalidatePath: vi.fn(),
}));

import { updateOwnProfile, verifyPerson } from "@/lib/actions/people";

const FATIMA = "11111111-1111-1111-1111-100000000011";

const validProfile = {
  full_name: "Ada Okafor",
  phone: "+234 800 000 0000",
  graduation_year: 2024,
  year_group: 4,
};

describe("updateOwnProfile", () => {
  beforeEach(() => {
    getUser.mockReset();
    maybeSingle.mockReset();
    updateEq.mockReset();
    from.mockClear();
  });

  it("rejects extra fields before calling Supabase", async () => {
    const result = await updateOwnProfile({
      ...validProfile,
      status: "inactive",
    });

    expect(result.ok).toBe(false);
    expect(getUser).not.toHaveBeenCalled();
  });

  it("requires a signed-in user", async () => {
    getUser.mockResolvedValue({ data: { user: null }, error: null });

    const result = await updateOwnProfile(validProfile);

    expect(result).toEqual({
      ok: false,
      error: "You must be signed in to update your profile.",
    });
  });

  it("updates the current person's row with only editable fields", async () => {
    getUser.mockResolvedValue({
      data: { user: { id: "auth-user-id" } },
      error: null,
    });
    maybeSingle.mockResolvedValue({
      data: { id: "person-id", status: "verified" },
      error: null,
    });
    updateEq.mockResolvedValue({ error: null });

    const result = await updateOwnProfile(validProfile);

    expect(result).toEqual({ ok: true, data: { saved: true } });
    expect(update).toHaveBeenCalledWith(validProfile);
    expect(updateEq).toHaveBeenCalledWith("id", "person-id");
  });

  it("returns an error when the profile update fails", async () => {
    getUser.mockResolvedValue({
      data: { user: { id: "auth-user-id" } },
      error: null,
    });
    maybeSingle.mockResolvedValue({
      data: { id: "person-id", status: "verified" },
      error: null,
    });
    updateEq.mockResolvedValue({ error: { message: "RLS rejected" } });

    const result = await updateOwnProfile(validProfile);

    expect(result).toEqual({
      ok: false,
      error: "Your profile could not be saved. Try again.",
    });
  });
});

describe("verifyPerson", () => {
  beforeEach(() => {
    rpc.mockReset();
    getSessionPerson.mockReset();
    loadPlatformAccess.mockReset();
    getSessionPerson.mockResolvedValue({
      id: "11111111-1111-1111-1111-100000000001",
      full_name: "Ada Okafor",
      email: "ada.founder@example.org",
      status: "verified",
    });
    loadPlatformAccess.mockResolvedValue({
      isFounder: true,
      permissions: [],
    });
  });

  it("rejects invalid input before calling Supabase", async () => {
    const result = await verifyPerson({ personId: "not-a-uuid" });

    expect(result.ok).toBe(false);
    expect(rpc).not.toHaveBeenCalled();
  });

  it("requires a signed-in person", async () => {
    getSessionPerson.mockResolvedValue(null);

    const result = await verifyPerson({ personId: FATIMA });

    expect(result).toEqual({
      ok: false,
      error: "Sign in again before verifying a person.",
    });
    expect(rpc).not.toHaveBeenCalled();
  });

  it("requires people update permission", async () => {
    loadPlatformAccess.mockResolvedValue({
      isFounder: false,
      permissions: [{ module: "people", operation: "read" }],
    });

    const result = await verifyPerson({ personId: FATIMA });

    expect(result).toEqual({
      ok: false,
      error: "You cannot verify people. Ask a people manager for help.",
    });
    expect(rpc).not.toHaveBeenCalled();
  });

  it("calls verify_person_by_admin for authorized users", async () => {
    rpc.mockResolvedValue({ error: null });

    const result = await verifyPerson({ personId: FATIMA });

    expect(result).toEqual({ ok: true, data: { verified: true } });
    expect(rpc).toHaveBeenCalledWith("verify_person_by_admin", {
      p_person_id: FATIMA,
    });
  });

  it("maps a not pending rejection from the database", async () => {
    rpc.mockResolvedValue({
      error: { message: "only a pending person can be verified" },
    });

    const result = await verifyPerson({ personId: FATIMA });

    expect(result).toEqual({
      ok: false,
      error: "Only a pending person can be verified.",
    });
  });
});
