import { cleanup, render, screen } from "@testing-library/react";
import { afterEach, describe, expect, it } from "vitest";
import JoinApplicationPage from "./page";

describe("JoinApplicationPage", () => {
  afterEach(cleanup);

  it("shows the join application heading and explains the unavailable account setup", () => {
    render(JoinApplicationPage());
    expect(
      screen.getByRole("heading", { name: "Apply to join BTE" })
    ).toBeVisible();
    expect(
      screen.getByText(/Account setup is currently unavailable/)
    ).toBeVisible();
  });
});
