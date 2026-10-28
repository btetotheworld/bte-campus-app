import { beforeEach, describe, expect, it, vi } from "vitest";

const mocks = vi.hoisted(() => ({
  person: vi.fn(),
  roles: vi.fn(),
  permissions: vi.fn(),
  memberships: vi.fn(),
}));
vi.mock("@/lib/auth/session", () => ({ getSessionPerson: mocks.person }));
vi.mock("@/lib/supabase/server", () => ({
  createClient: vi.fn(async () => ({
    from: (table: string) => {
      if (table === "platform_roles")
        return { select: () => ({ eq: mocks.roles }) };
      if (table === "memberships")
        return { select: () => ({ eq: () => ({ is: mocks.memberships }) }) };
      return { select: mocks.permissions };
    },
  })),
}));
import { loadPlatformAccess } from "./permissions";
import { canAccess } from "./nav-access";

describe("loadPlatformAccess", () => {
  beforeEach(() => {
    vi.clearAllMocks();
    mocks.person.mockResolvedValue({ id: "current-person" });
    mocks.roles.mockResolvedValue({
      data: [{ role: "people_manager" }],
      error: null,
    });
    mocks.permissions.mockResolvedValue({
      data: [
        { role: "people_manager", module: "departments", operation: "read" },
        { role: "people_manager", module: "departments", operation: "create" },
        { role: "people_manager", module: "departments", operation: "update" },
        { role: "auditor", module: "departments", operation: "read" },
      ],
      error: null,
    });
    mocks.memberships.mockResolvedValue({ data: [], error: null });
  });
  it("rejects a missing or inactive session", async () => {
    mocks.person.mockResolvedValue(null);
    expect(await loadPlatformAccess()).toEqual({
      isFounder: false,
      permissions: [],
    });
    expect(mocks.roles).not.toHaveBeenCalled();
  });
  it("uses the current person's roles and catalogue permissions", async () => {
    const access = await loadPlatformAccess();
    expect(canAccess(access, "departments", "create")).toBe(true);
    expect(canAccess(access, "departments", "update")).toBe(true);
    expect(mocks.roles).toHaveBeenCalledWith("person_id", "current-person");
    expect(mocks.permissions).toHaveBeenCalledWith("role, module, operation");
  });
  it("matches the existing founder override", async () => {
    mocks.roles.mockResolvedValue({ data: [{ role: "founder" }], error: null });
    expect(canAccess(await loadPlatformAccess(), "departments", "create")).toBe(
      true
    );
  });
  it.each([
    [],
    [{ operation: "read" }],
    [{ operation: "create" }],
    [{ operation: "update" }],
  ])("denies insufficient permissions: %j", async (...operations) => {
    mocks.permissions.mockResolvedValue({
      data: operations.map((permission) => ({
        ...permission,
        role: "people_manager",
        module: "departments",
      })),
      error: null,
    });
    const access = await loadPlatformAccess();
    expect(
      canAccess(access, "departments", "create") &&
        canAccess(access, "departments", "update")
    ).toBe(false);
  });
  it("denies people with no platform roles", async () => {
    mocks.roles.mockResolvedValue({ data: [], error: null });
    expect(canAccess(await loadPlatformAccess(), "departments", "create")).toBe(
      false
    );
  });
  it("fails closed on permission lookup failures", async () => {
    mocks.permissions.mockResolvedValue({
      data: null,
      error: { message: "offline" },
    });
    expect(await loadPlatformAccess()).toEqual({
      isFounder: false,
      permissions: [],
    });
  });
  it("allows auditors to read departments without write access", async () => {
    mocks.roles.mockResolvedValue({ data: [{ role: "auditor" }], error: null });
    const access = await loadPlatformAccess();
    expect(canAccess(access, "departments", "read")).toBe(true);
    expect(canAccess(access, "departments", "create")).toBe(false);
    expect(canAccess(access, "departments", "update")).toBe(false);
  });
  it("does not treat chapter membership as department module access", async () => {
    mocks.roles.mockResolvedValue({ data: [], error: null });
    mocks.memberships.mockResolvedValue({
      data: [{ role: "campus_lead" }],
      error: null,
    });
    expect(canAccess(await loadPlatformAccess(), "departments", "read")).toBe(
      false
    );
  });
});
