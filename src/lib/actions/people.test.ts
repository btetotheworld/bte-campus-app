import { beforeEach, describe, expect, it, vi } from "vitest";

const {
  getSessionPerson,
  getSessionAccess,
  getUser,
  maybeSingle,
  update,
  updateEq,
  insert,
  from,
} = vi.hoisted(() => {
  const mockedMaybeSingle = vi.fn();
  const mockedUpdate = vi.fn();
  const mockedUpdateEq = vi.fn();
  const mockedInsert = vi.fn();
  const mockedFrom = vi.fn(() => ({
    select: vi.fn(() => ({
      eq: vi.fn(() => ({ maybeSingle: mockedMaybeSingle })),
    })),
    update: mockedUpdate,
    insert: mockedInsert,
  }));

  return {
    getSessionPerson: vi.fn(),
    getSessionAccess: vi.fn(),
    maybeSingle: mockedMaybeSingle,
    update: mockedUpdate,
    updateEq: mockedUpdateEq,
    insert: mockedInsert,
    from: mockedFrom,
  };
});

vi.mock("@/lib/auth/session", () => ({ getSessionPerson }));
vi.mock("@/lib/auth/permissions", () => ({ getSessionAccess }));
vi.mock("@/lib/supabase/server", () => ({
  createClient: vi.fn(async () => ({ 
    auth: {
      getUser,
    },
      from 
  })),
}));
vi.mock("next/cache", () => ({ revalidatePath: vi.fn() }));

import {
  approveJoinApplication,
  declineJoinApplication,
  updateOwnProfile,
} from "@/lib/actions/people";

const applicationId = "11111111-1111-1111-1111-100000000001";
const personId = "11111111-1111-1111-1111-100000000002";
const departmentId = "11111111-1111-1111-1111-100000000003";

const validApproval = {
  applicationId,
  departmentId,
  role: "campus_lead" as const,
};

beforeEach(() => {
  getSessionPerson.mockReset();
  getSessionAccess.mockReset();
  maybeSingle.mockReset();
  update.mockReset();
  getUser.mockReset();
  update.mockImplementation(() => ({ eq: updateEq }));
  updateEq.mockReset();
  insert.mockReset();
  from.mockClear();
});

describe("approveJoinApplication", () => {
  it("rejects an invalid request before authentication", async () => {
    const result = await approveJoinApplication({ applicationId });

    expect(result.ok).toBe(false);
    expect(getSessionPerson).not.toHaveBeenCalled();
  });

  it("requires People approval access", async () => {
    getSessionPerson.mockResolvedValue({ id: "actor-id" });
    getSessionAccess.mockResolvedValue({ isFounder: false, permissions: [] });

    const result = await approveJoinApplication(validApproval);

    expect(result).toEqual({
      ok: false,
      error: "You cannot approve applications.",
    });
    expect(from).not.toHaveBeenCalled();
  });

  it("updates the existing person and assigns the department", async () => {
    getSessionPerson.mockResolvedValue({ id: "actor-id" });
    getSessionAccess.mockResolvedValue({
      isFounder: false,
      permissions: [{ module: "join_apps", operation: "update" }],
    });
    maybeSingle.mockResolvedValue({
      data: { person_id: personId, status: "submitted" },
      error: null,
    });
    updateEq
      .mockResolvedValueOnce({ error: null })
      .mockResolvedValueOnce({ error: null });
    insert.mockResolvedValue({ error: null });

    const result = await approveJoinApplication(validApproval);

    expect(result).toEqual({ ok: true, data: { approved: true } });
    expect(update).toHaveBeenNthCalledWith(1, { kind: "team" });
    expect(update).toHaveBeenNthCalledWith(2, { status: "approved" });
    expect(updateEq).toHaveBeenNthCalledWith(1, "id", personId);
    expect(updateEq).toHaveBeenNthCalledWith(2, "id", applicationId);
    expect(insert).toHaveBeenCalledWith({
      person_id: personId,
      department_id: departmentId,
      role: "campus_lead",
    });
  });
});

describe("declineJoinApplication", () => {
  it("sets the existing person inactive and rejects the application", async () => {
    getSessionPerson.mockResolvedValue({ id: "actor-id" });
    getSessionAccess.mockResolvedValue({ isFounder: true, permissions: [] });
    maybeSingle.mockResolvedValue({
      data: { person_id: personId, status: "submitted" },
      error: null,
    });
    updateEq
      .mockResolvedValueOnce({ error: null })
      .mockResolvedValueOnce({ error: null });

    const result = await declineJoinApplication({ applicationId });

    expect(result).toEqual({ ok: true, data: { declined: true } });
    expect(update).toHaveBeenNthCalledWith(1, { status: "inactive" });
    expect(update).toHaveBeenNthCalledWith(2, { status: "rejected" });
    expect(updateEq).toHaveBeenNthCalledWith(1, "id", personId);
    expect(updateEq).toHaveBeenNthCalledWith(2, "id", applicationId);
const getUser = vi.fn();
const maybeSingle = vi.fn();
const updateEq = vi.fn();
const selectEq = vi.fn(() => ({ maybeSingle }));
const select = vi.fn(() => ({ eq: selectEq }));
const update = vi.fn(() => ({ eq: updateEq }));
const from = vi.fn(() => ({ select, update }));

vi.mock("@/lib/supabase/server", () => ({
  createClient: vi.fn(async () => ({
    auth: { getUser },
    from,
  })),
}));

vi.mock("next/cache", () => ({
  revalidatePath: vi.fn(),
}));

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
