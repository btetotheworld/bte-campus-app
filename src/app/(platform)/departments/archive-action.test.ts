import { beforeEach, describe, expect, it, vi } from "vitest";

const mocks = vi.hoisted(() => ({
  session: vi.fn(),
  access: vi.fn(),
  from: vi.fn(),
  update: vi.fn(),
  eq: vi.fn(),
  is: vi.fn(),
  result: vi.fn(),
  revalidate: vi.fn(),
}));
vi.mock("@/lib/auth/session", () => ({ getSessionPerson: mocks.session }));
vi.mock("@/lib/auth/permissions", () => ({ loadPlatformAccess: mocks.access }));
vi.mock("next/cache", () => ({ revalidatePath: mocks.revalidate }));
vi.mock("@/lib/supabase/server", () => ({
  createClient: async () => ({ from: mocks.from }),
}));
import { archiveDepartment } from "./archive-action";

const id = "aaaaaaaa-0000-0000-0000-000000000001";
describe("archiveDepartment", () => {
  beforeEach(() => {
    vi.clearAllMocks();
    mocks.session.mockResolvedValue({ id: "actor" });
    mocks.access.mockResolvedValue({ isFounder: true, permissions: [] });
    mocks.from.mockReturnValue({ update: mocks.update });
    mocks.update.mockReturnValue({ eq: mocks.eq });
    mocks.eq.mockReturnValue({ is: mocks.is });
    mocks.is.mockReturnValue({ select: () => ({ maybeSingle: mocks.result }) });
    mocks.result.mockResolvedValue({ data: { id }, error: null });
  });
  it("rejects unvalidated input before accessing the database", async () => {
    expect(
      (await archiveDepartment({ id, archived_at: "client timestamp" })).ok
    ).toBe(false);
    expect(mocks.session).not.toHaveBeenCalled();
    expect(mocks.from).not.toHaveBeenCalled();
  });
  it("rejects signed-out direct calls", async () => {
    mocks.session.mockResolvedValue(null);
    expect((await archiveDepartment({ id })).ok).toBe(false);
    expect(mocks.from).not.toHaveBeenCalled();
  });
  it("rejects a read-only user", async () => {
    mocks.access.mockResolvedValue({
      isFounder: false,
      permissions: [{ module: "departments", operation: "read" }],
    });
    expect((await archiveDepartment({ id })).ok).toBe(false);
    expect(mocks.from).not.toHaveBeenCalled();
  });
  it("updates only the archive timestamp and preserves related history", async () => {
    expect(await archiveDepartment({ id })).toEqual({ ok: true, data: { id } });
    expect(mocks.from).toHaveBeenCalledExactlyOnceWith("departments");
    expect(mocks.update).toHaveBeenCalledExactlyOnceWith({
      archived_at: expect.stringMatching(/^\d{4}-.*Z$/),
    });
    expect(mocks.eq).toHaveBeenCalledWith("id", id);
    expect(mocks.is).toHaveBeenCalledWith("archived_at", null);
    expect(mocks.revalidate.mock.calls).toEqual([
      ["/departments"],
      ["/departments/archived"],
      [`/departments/${id}`],
    ]);
  });
  it.each([
    { data: null, error: null },
    { data: null, error: { message: "private database details" } },
  ])(
    "does not claim success for absent, archived or RLS-rejected rows",
    async (result) => {
      mocks.result.mockResolvedValue(result);
      const response = await archiveDepartment({ id });
      expect(response.ok).toBe(false);
      expect(JSON.stringify(response)).not.toContain(
        "private database details"
      );
      expect(mocks.revalidate).not.toHaveBeenCalled();
    }
  );
  it("fails closed if permissions cannot be loaded", async () => {
    mocks.access.mockRejectedValue(new Error("offline"));
    expect((await archiveDepartment({ id })).ok).toBe(false);
    expect(mocks.from).not.toHaveBeenCalled();
  });
});
