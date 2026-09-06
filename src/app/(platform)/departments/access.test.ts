import { beforeEach, describe, expect, it, vi } from "vitest";

const mocks = vi.hoisted(() => ({
  person: vi.fn(),
  roles: vi.fn(),
  permissions: vi.fn(),
}));
vi.mock("@/lib/auth/session", () => ({ getSessionPerson: mocks.person }));
vi.mock("@/lib/supabase/server", () => ({
  createClient: vi.fn(async () => ({
    from: (table: string) =>
      table === "platform_roles"
        ? { select: () => ({ eq: mocks.roles }) }
        : {
            select: () => ({
              in: () => ({ eq: () => ({ eq: mocks.permissions }) }),
            }),
          },
  })),
}));
import { getDepartmentAccess } from "./access";

describe("getDepartmentAccess", () => {
  beforeEach(() => {
    vi.clearAllMocks();
    mocks.person.mockResolvedValue({ id: "current-person" });
    mocks.roles.mockResolvedValue({
      data: [{ role: "people_manager" }],
      error: null,
    });
    mocks.permissions.mockResolvedValue({
      data: [{ operation: "create" }, { operation: "update" }],
      error: null,
    });
  });
  it("rejects a missing or inactive session", async () => {
    mocks.person.mockResolvedValue(null);
    expect(await getDepartmentAccess()).toEqual({
      signedIn: false,
      canCreate: false,
    });
    expect(mocks.roles).not.toHaveBeenCalled();
  });
  it("uses the current person's roles and catalogue permissions", async () => {
    expect((await getDepartmentAccess()).canCreate).toBe(true);
    expect(mocks.roles).toHaveBeenCalledWith("person_id", "current-person");
    expect(mocks.permissions).toHaveBeenCalledWith("scope", "global");
  });
  it("matches the existing founder override", async () => {
    mocks.roles.mockResolvedValue({ data: [{ role: "founder" }], error: null });
    expect((await getDepartmentAccess()).canCreate).toBe(true);
    expect(mocks.permissions).not.toHaveBeenCalled();
  });
  it.each([
    [],
    [{ operation: "read" }],
    [{ operation: "create" }],
    [{ operation: "update" }],
  ])("denies insufficient permissions: %j", async (...operations) => {
    mocks.permissions.mockResolvedValue({ data: operations, error: null });
    expect((await getDepartmentAccess()).canCreate).toBe(false);
  });
  it("denies people with no platform roles", async () => {
    mocks.roles.mockResolvedValue({ data: [], error: null });
    expect((await getDepartmentAccess()).canCreate).toBe(false);
  });
  it("surfaces permission lookup failures", async () => {
    mocks.permissions.mockResolvedValue({
      data: null,
      error: { message: "offline" },
    });
    await expect(getDepartmentAccess()).rejects.toThrow(
      "permissions could not be loaded"
    );
  });
});
