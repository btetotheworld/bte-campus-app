import { describe, expect, it } from "vitest";
import { render, screen } from "@testing-library/react";
import Home from "./page";

describe("Home", () => {
  it("renders the platform heading and a link to the styleguide", () => {
    render(<Home />);

    expect(
      screen.getByRole("heading", { name: /believers tech expo/i })
    ).toBeInTheDocument();

    const link = screen.getByRole("link", { name: /view the styleguide/i });
    expect(link).toHaveAttribute("href", "/styleguide");
  });
});
