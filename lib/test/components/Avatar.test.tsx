import { act, render, screen, waitFor } from "@testing-library/react";

import { Avatar } from "../../src";

describe("Avatar", () => {
  it("renders", () => {
    render(<Avatar username="Adam" />);
    expect(screen.getByText("A")).toBeInTheDocument();
  });

  it("renders text when image doesn't exist", async () => {
    render(<Avatar backgroundImage="404" username="Adam" />);

    const img = screen.getByAltText("");
    act(() => {
      img.dispatchEvent(new Event("error"));
    });

    await waitFor(() => {
      expect(screen.getByText("A")).toBeInTheDocument();
    });
  });
});
