import { describe, expect, it } from "vitest";
import { render, screen } from "@testing-library/react";
import PlatformHomePage from "./page";

describe("Platform home", () => {
  it("renders the dashboard heading and zeroed tiles", () => {
    render(<PlatformHomePage />);

    expect(
      screen.getByRole("heading", { name: "Home", level: 1 })
    ).toBeInTheDocument();
    expect(
      screen.getByText(
        "Nothing needs you today. Flags will appear here once chapters file reports and reviews open."
      )
    ).toBeInTheDocument();
    expect(screen.getAllByText("0")).toHaveLength(3);
  });
});
