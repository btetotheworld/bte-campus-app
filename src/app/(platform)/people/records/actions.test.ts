import { beforeEach, describe, expect, it, vi } from "vitest";

const mocks = vi.hoisted(() => ({
  session: vi.fn(),
  access: vi.fn(),
  from: vi.fn(),
  update: vi.fn(),
  eq: vi.fn(),
  result: vi.fn(),
  revalidate: vi.fn(),
}));
vi.mock("@/lib/auth/session", () => ({ getSessionPerson: mocks.session }));
vi.mock("@/lib/auth/permissions", () => ({ loadPlatformAccess: mocks.access }));
vi.mock("@/lib/supabase/server", () => ({
  createClient: async () => ({ from: mocks.from }),
}));
vi.mock("next/cache", () => ({ revalidatePath: mocks.revalidate }));
import { editPersonRecord } from "./actions";
const id = "aaaaaaaa-0000-0000-0000-000000000001";
const input = {
  id,
  full_name: "Example Person",
  phone: null,
};

describe("editPersonRecord", () => {
  beforeEach(() => {
    vi.clearAllMocks();
    mocks.session.mockResolvedValue({ id: "admin" });
    mocks.access.mockResolvedValue({
      isFounder: false,
      permissions: [{ module: "people", operation: "update" }],
    });
    mocks.from.mockReturnValue({ update: mocks.update });
    mocks.update.mockReturnValue({ eq: mocks.eq });
    mocks.eq.mockReturnValue({ select: () => ({ maybeSingle: mocks.result }) });
    mocks.result.mockResolvedValue({ data: { id }, error: null });
  });
  it("rejects lifecycle or access changes before checking permissions", async () => {
    expect((await editPersonRecord({ ...input, status: "verified" })).ok).toBe(
      false
    );
    expect(mocks.session).not.toHaveBeenCalled();
  });
  it("rejects a signed-out caller", async () => {
    mocks.session.mockResolvedValue(null);
    expect((await editPersonRecord(input)).ok).toBe(false);
    expect(mocks.from).not.toHaveBeenCalled();
  });
  it.each([
    { permissions: [] },
    { permissions: [{ module: "people", operation: "read" }] },
  ])("rejects non-admin direct calls", async ({ permissions }) => {
    mocks.access.mockResolvedValue({ isFounder: false, permissions });
    expect((await editPersonRecord(input)).ok).toBe(false);
    expect(mocks.from).not.toHaveBeenCalled();
  });
  it("updates the existing person with only editable fields", async () => {
    expect(await editPersonRecord(input)).toEqual({ ok: true, data: { id } });
    expect(mocks.from).toHaveBeenCalledExactlyOnceWith("people");
    expect(mocks.update).toHaveBeenCalledWith({
      full_name: "Example Person",
      phone: null,
    });
    expect(mocks.eq).toHaveBeenCalledWith("id", id);
    expect(mocks.revalidate).toHaveBeenCalledWith(`/people/records/${id}`);
  });
  it.each([
    { data: null, error: null },
    { data: null, error: { message: "private SQL error" } },
  ])("does not claim success when no row is updated", async (result) => {
    mocks.result.mockResolvedValue(result);
    const response = await editPersonRecord(input);
    expect(response.ok).toBe(false);
    expect(JSON.stringify(response)).not.toContain("private SQL error");
    expect(mocks.revalidate).not.toHaveBeenCalled();
  });
  it("fails closed when permission loading fails", async () => {
    mocks.access.mockRejectedValue(new Error("offline"));
    expect((await editPersonRecord(input)).ok).toBe(false);
    expect(mocks.from).not.toHaveBeenCalled();
  });
});
