import { act, render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";

import { Carousel } from "../../src";

const Wrapper = () => (
  <Carousel data-testid="carousel">
    <div style={{ padding: 128 }}>1</div>
    <div style={{ padding: 128 }}>2</div>
    <div style={{ padding: 128 }}>3</div>
  </Carousel>
);

const dispatchTransitionEnd = () => {
  const slider = screen.getByTestId("carousel").firstChild!;
  act(() => {
    slider.dispatchEvent(new Event("transitionend", { bubbles: true }));
  });
};

describe("Carousel", () => {
  it("renders", () => {
    render(<Wrapper />);
    expect(screen.getByTestId("carousel")).toBeInTheDocument();
  });

  it("only renders first slides in the document", () => {
    render(<Wrapper />);
    expect(screen.queryByText("3")).not.toBeInTheDocument();
  });

  it("moves forward and backward", async () => {
    const user = userEvent.setup();
    render(<Wrapper />);

    const [left, right, dot1, dot2, dot3] = screen.getAllByRole("button");

    await user.click(right);
    dispatchTransitionEnd();

    expect(screen.queryByText("1")).not.toBeInTheDocument();
    expect(screen.getByText("2").parentElement).not.toHaveAttribute(
      "aria-hidden",
      "true"
    );
    expect(screen.getByText("3").parentElement).toHaveAttribute(
      "aria-hidden",
      "true"
    );
    expect(dot1).not.toBeDisabled();
    expect(dot2).toBeDisabled();
    expect(dot3).not.toBeDisabled();

    await user.click(left);
    dispatchTransitionEnd();

    expect(screen.getByText("1")).toBeInTheDocument();
    expect(screen.getByText("1").parentElement).not.toHaveAttribute(
      "aria-hidden",
      "true"
    );
    expect(dot1).toBeDisabled();
    expect(dot2).not.toBeDisabled();
    expect(dot3).not.toBeDisabled();
  });
});
