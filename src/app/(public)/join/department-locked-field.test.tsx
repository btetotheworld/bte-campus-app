import { cleanup, render, screen } from "@testing-library/react";
import { afterEach, describe, expect, it } from "vitest";
import { DepartmentLockedField } from "./department-locked-field";

describe("DepartmentLockedField", () => {
  afterEach(cleanup);

  it("shows the selected department as fixed application context", () => {
    render(
      <DepartmentLockedField
        departmentId="11111111-1111-1111-1111-100000000001"
        departmentName="Media team"
      />
    );
    expect(screen.getByLabelText("Department")).toHaveValue("Media team");
    expect(screen.getByLabelText("Department")).toHaveAttribute(
      "aria-readonly",
      "true"
    );
    expect(screen.getByText(/You cannot change it/)).toBeVisible();
    expect(
      document.querySelector('input[type="hidden"][name="departmentId"]')
    ).toHaveValue("11111111-1111-1111-1111-100000000001");
  });
});
