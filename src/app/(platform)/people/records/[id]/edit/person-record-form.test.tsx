import {
  cleanup,
  fireEvent,
  render,
  screen,
  waitFor,
} from "@testing-library/react";
import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";
const mocks = vi.hoisted(() => ({
  save: vi.fn(),
  push: vi.fn(),
  refresh: vi.fn(),
}));
vi.mock("../../actions", () => ({ editPersonRecord: mocks.save }));
vi.mock("next/navigation", () => ({
  useRouter: () => ({ push: mocks.push, refresh: mocks.refresh }),
}));
import { PersonRecordForm } from "./person-record-form";
const person = {
  id: "aaaaaaaa-0000-0000-0000-000000000001",
  full_name: "Example Person",
  phone: null,
};
describe("PersonRecordForm", () => {
  beforeEach(() => vi.clearAllMocks());
  afterEach(cleanup);
  it("edits only name and phone, preserving null for a blank phone", async () => {
    mocks.save.mockResolvedValue({ ok: true, data: { id: person.id } });
    render(<PersonRecordForm person={person} />);
    expect(screen.getAllByRole("textbox")).toHaveLength(2);
    fireEvent.change(screen.getByLabelText("Full name"), {
      target: { value: " Updated Name " },
    });
    fireEvent.click(screen.getByRole("button", { name: "Save person record" }));
    await waitFor(() =>
      expect(mocks.push).toHaveBeenCalledWith(`/people/records/${person.id}`)
    );
    expect(mocks.save).toHaveBeenCalledWith({
      ...person,
      full_name: "Updated Name",
    });
  });
  it("focuses an invalid name without saving", () => {
    render(<PersonRecordForm person={person} />);
    fireEvent.change(screen.getByLabelText("Full name"), {
      target: { value: " " },
    });
    fireEvent.click(screen.getByRole("button", { name: "Save person record" }));
    expect(screen.getByLabelText("Full name")).toHaveFocus();
    expect(screen.getByRole("alert")).toHaveTextContent(
      "Enter the person's full name."
    );
    expect(mocks.save).not.toHaveBeenCalled();
  });
  it("keeps user input after rejected writes", async () => {
    mocks.save.mockResolvedValue({
      ok: false,
      error: "The person record could not be saved. Refresh and try again.",
    });
    render(<PersonRecordForm person={person} />);
    fireEvent.click(screen.getByRole("button", { name: "Save person record" }));
    expect(await screen.findByRole("alert")).toHaveTextContent(
      "could not be saved"
    );
    expect(screen.getByLabelText("Full name")).toHaveValue("Example Person");
    expect(mocks.push).not.toHaveBeenCalled();
  });
});
