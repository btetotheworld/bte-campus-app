import { describe, expect, it } from "vitest";
import {
  grantErrorMessage,
  revokeErrorMessage,
} from "@/lib/actions/platform-role-messages";

describe("grantErrorMessage", () => {
  it("maps the self-grant trigger", () => {
    expect(grantErrorMessage("Nobody grants themselves a platform role")).toBe(
      "You cannot grant a role to yourself."
    );
  });

  it("maps the rank trigger", () => {
    expect(
      grantErrorMessage("Nobody grants a role equal to or above their own")
    ).toBe("You cannot grant a role equal to or above your own.");
  });
});

describe("revokeErrorMessage", () => {
  it("maps the last founder trigger", () => {
    expect(revokeErrorMessage("Removing the last founder is blocked")).toBe(
      "Removing the last founder is blocked."
    );
  });
});
