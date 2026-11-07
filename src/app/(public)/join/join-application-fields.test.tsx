import { cleanup, render, screen } from "@testing-library/react";
import { afterEach, describe, expect, it } from "vitest";
import { JoinApplicationFields } from "./join-application-fields";

describe("JoinApplicationFields", () => {
  afterEach(cleanup);

  it("renders the documented general application fields", () => {
    render(<JoinApplicationFields />);
    expect(screen.getByLabelText("Full name")).toBeDisabled();
    expect(screen.getByLabelText("Email address")).toBeDisabled();
    expect(
      screen.getByText("I confirm that I am at least 18 years old.")
    ).toBeVisible();
    expect(
      screen.getByRole("button", { name: "Save application draft" })
    ).toBeDisabled();
  });

  it("states the foundation blocker instead of accepting an unsafe write", () => {
    render(<JoinApplicationFields />);
    expect(screen.getByRole("alert")).toHaveTextContent(
      "Account setup is required"
    );
  });
});
