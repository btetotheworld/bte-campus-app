import { beforeEach, describe, expect, it, vi } from "vitest";

const {
  getSessionPerson,
  getSessionAccess,
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
  createClient: vi.fn(async () => ({ from })),
}));
vi.mock("next/cache", () => ({ revalidatePath: vi.fn() }));

import {
  approveJoinApplication,
  declineJoinApplication,
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
  update.mockImplementation(() => ({ eq: updateEq }));
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
  });
});
