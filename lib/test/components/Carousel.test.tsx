import { act, render, screen, waitFor } from "@testing-library/react";
import userEvent from "@testing-library/user-event";

import { Carousel } from "../../src";

const Wrapper = () => (
  <Carousel data-testid="carousel">
    <div style={{ padding: 128 }}>1</div>
    <div style={{ padding: 128 }}>2</div>
    <div style={{ padding: 128 }}>3</div>
  </Carousel>
);

describe("Carousel", () => {
  it("renders", () => {
    render(<Wrapper />);
    expect(screen.getByTestId("carousel")).toBeInTheDocument();
  });

  it("only renders first slides in the document", async () => {
    render(<Wrapper />);
    expect(screen.queryByText("3")).not.toBeInTheDocument();
  });

  it("moves forward and backward", async () => {
    const { container } = render(<Wrapper />);
    const buttons = await waitFor(() => {
      const btns = container.querySelectorAll("button");
      if (btns.length === 0) throw new Error("No buttons found");
      return btns;
    });

    const [left, right, dot1, dot2, dot3] = buttons;

    await userEvent.click(right);

    const slider = screen.getByTestId("carousel").firstChild!;
    act(() => {
      slider.dispatchEvent(new Event("transitionend", { bubbles: true }));
    });

    await waitFor(() => {
      expect(screen.queryByText("1")).not.toBeInTheDocument();
      expect(screen.getByText("2").parentNode).not.toHaveAttribute(
        "aria-hidden",
        "true"
      );
      expect(screen.getByText("3").parentNode).toHaveAttribute(
        "aria-hidden",
        "true"
      );
      expect(dot1).not.toBeDisabled();
      expect(dot2).toBeDisabled();
      expect(dot3).not.toBeDisabled();
    });

    await userEvent.click(left);

    act(() => {
      slider.dispatchEvent(new Event("transitionend", { bubbles: true }));
    });

    await waitFor(() => {
      expect(screen.getByText("1")).toBeInTheDocument();
      expect(screen.getByText("1").parentNode).not.toHaveAttribute(
        "aria-hidden",
        "true"
      );
      expect(dot1).toBeDisabled();
      expect(dot2).not.toBeDisabled();
      expect(dot3).not.toBeDisabled();
    });
  });
});
