import { describe, expect, it } from "vitest";
import { assemblePublicDepartments, publicRoleLabel } from "./public-directory-data";

describe("public directory data", () => {
  it("attaches only people returned by public RLS and sorts them by name", () => {
    const departments = [
      { id: "department", name: "Media", kind: "team" as const },
    ];
    const memberships = [
      {
        person_id: "person-b",
        department_id: "department",
        role: "member" as const,
      },
      {
        person_id: "person-a",
        department_id: "department",
        role: "coordinator" as const,
      },
      {
        person_id: "hidden-by-rls",
        department_id: "department",
        role: "member" as const,
      },
    ];
    const people = [
      { id: "person-b", full_name: "Zainab Bello" },
      { id: "person-a", full_name: "Ada Okafor" },
    ];
    expect(assemblePublicDepartments(departments, memberships, people)).toEqual([
      {
        ...departments[0],
        team: [
          { ...people[1], role: "coordinator" },
          { ...people[0], role: "member" },
        ],
      },
    ]);
  });

  it("uses the documented public role labels", () => {
    expect(publicRoleLabel("assistant_lead")).toBe("Assistant lead");
    expect(publicRoleLabel("member")).toBe("Volunteer");
  });
});
