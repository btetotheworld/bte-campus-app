import { describe, expect, it } from "vitest";
import {
  canOpenPath,
  visibleNavItems,
  type SessionAccess,
} from "@/lib/auth/nav-access";

function labels(access: SessionAccess) {
  return visibleNavItems(access).map((item) => item.label);
}

describe("visibleNavItems", () => {
  it("shows every item to a founder", () => {
    expect(labels({ isFounder: true, permissions: [] })).toEqual([
      "Home",
      "People",
      "Chapters",
      "Applications",
      "Meetings",
      "Members",
      "Submissions",
      "Health",
    ]);
  });

  it("shows only Home when the person has no roles", () => {
    expect(labels({ isFounder: false, permissions: [] })).toEqual(["Home"]);
  });

  it("shows the coordinator campus and people reads", () => {
    expect(
      labels({
        isFounder: false,
        permissions: [
          { module: "people", operation: "read" },
          { module: "chapters", operation: "read" },
          { module: "campus_applications", operation: "read" },
          { module: "meetings", operation: "read" },
          { module: "chapter_members", operation: "read" },
          { module: "succession", operation: "read" },
        ],
      })
    ).toEqual([
      "Home",
      "People",
      "Chapters",
      "Applications",
      "Meetings",
      "Members",
      "Health",
    ]);
  });

  it("shows meetings and members for a campus lead", () => {
    expect(
      labels({
        isFounder: false,
        permissions: [
          { module: "meetings", operation: "read" },
          { module: "chapter_members", operation: "read" },
        ],
      })
    ).toEqual(["Home", "Meetings", "Members"]);
  });

  it("shows meetings and submissions for a chapter member", () => {
    expect(
      labels({
        isFounder: false,
        permissions: [
          { module: "meetings", operation: "read" },
          { module: "submissions", operation: "read" },
        ],
      })
    ).toEqual(["Home", "Meetings", "Submissions"]);
  });
});

describe("canOpenPath", () => {
  const applicant: SessionAccess = { isFounder: false, permissions: [] };

  it("allows Home for every signed-in person", () => {
    expect(canOpenPath("/", applicant)).toBe(true);
  });

  it("rejects a gated path the person cannot read", () => {
    expect(canOpenPath("/people", applicant)).toBe(false);
    expect(canOpenPath("/campus/chapters", applicant)).toBe(false);
  });

  it("allows a nested path when the parent module is granted", () => {
    const lead: SessionAccess = {
      isFounder: false,
      permissions: [{ module: "meetings", operation: "read" }],
    };
    expect(canOpenPath("/campus/meetings/abc", lead)).toBe(true);
  });
});
