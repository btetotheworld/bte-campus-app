import { beforeEach, describe, expect, it, vi } from "vitest";

const mocks = vi.hoisted(() => ({
  access: vi.fn(),
  person: vi.fn(),
  insert: vi.fn(),
  single: vi.fn(),
  revalidate: vi.fn(),
}));
vi.mock("@/lib/auth/permissions", () => ({ loadPlatformAccess: mocks.access }));
vi.mock("@/lib/auth/session", () => ({ getSessionPerson: mocks.person }));
vi.mock("next/cache", () => ({ revalidatePath: mocks.revalidate }));
vi.mock("@/lib/supabase/server", () => ({
  createClient: vi.fn(async () => ({
    from: () => ({ insert: mocks.insert }),
  })),
}));
import { createDepartment } from "./departments";

describe("createDepartment", () => {
  beforeEach(() => {
    vi.clearAllMocks();
    mocks.person.mockResolvedValue({ id: "current-person" });
    mocks.access.mockResolvedValue({ isFounder: true, permissions: [] });
    mocks.insert.mockReturnValue({ select: () => ({ single: mocks.single }) });
    mocks.single.mockResolvedValue({ data: { id: "example-id" }, error: null });
  });
  it("validates before checking permissions or writing", async () => {
    expect((await createDepartment({ name: " ", kind: "team" })).ok).toBe(
      false
    );
    expect(mocks.access).not.toHaveBeenCalled();
    expect(mocks.insert).not.toHaveBeenCalled();
  });
  it("rejects a missing or inactive session", async () => {
    mocks.person.mockResolvedValue(null);
    expect((await createDepartment({ name: "Example", kind: "team" })).ok).toBe(
      false
    );
    expect(mocks.access).not.toHaveBeenCalled();
    expect(mocks.insert).not.toHaveBeenCalled();
  });
  it.each([[], ["read"], ["create"], ["update"]])(
    "rejects a direct call with insufficient permissions: %j",
    async (...operations) => {
      mocks.access.mockResolvedValue({
        isFounder: false,
        permissions: operations.map((operation) => ({
          module: "departments",
          operation,
        })),
      });
      expect(
        (await createDepartment({ name: "Example", kind: "team" })).ok
      ).toBe(false);
      expect(mocks.insert).not.toHaveBeenCalled();
    }
  );
  it("writes only validated fields and refreshes the list", async () => {
    expect(
      await createDepartment({ name: " Example ", kind: "campus_chapter" })
    ).toEqual({ ok: true, data: { id: "example-id" } });
    expect(mocks.insert).toHaveBeenCalledWith({
      name: "Example",
      kind: "campus_chapter",
    });
    expect(mocks.revalidate).toHaveBeenCalledWith("/departments");
  });
  it("allows a people manager with both create and update permissions", async () => {
    mocks.access.mockResolvedValue({
      isFounder: false,
      permissions: [
        { module: "departments", operation: "create" },
        { module: "departments", operation: "update" },
      ],
    });
    expect((await createDepartment({ name: "Example", kind: "team" })).ok).toBe(
      true
    );
    expect(mocks.insert).toHaveBeenCalledWith({
      name: "Example",
      kind: "team",
    });
  });
  it("does not report success when RLS or the database rejects the insert", async () => {
    mocks.single.mockResolvedValue({
      data: null,
      error: { message: "private database details" },
    });
    const result = await createDepartment({ name: "Example", kind: "team" });
    expect(result.ok).toBe(false);
    expect(JSON.stringify(result)).not.toContain("private database details");
    expect(mocks.revalidate).not.toHaveBeenCalled();
  });
  it("fails closed when permission loading fails", async () => {
    mocks.access.mockRejectedValue(new Error("connection failed"));
    expect((await createDepartment({ name: "Example", kind: "team" })).ok).toBe(
      false
    );
    expect(mocks.insert).not.toHaveBeenCalled();
  });
});
