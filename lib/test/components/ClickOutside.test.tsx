import React from "react";
import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { ClickOutside, Alert } from "../../src";

type Props = {
  children: React.ReactElement;
  onClickOutside: (event: MouseEvent) => void;
};

const Wrapper = (props: Props) => (
  <div data-testid="wrapper">
    <div data-testid="outside" style={{ padding: 32 }}>
      Outside
    </div>
    <ClickOutside {...props} />
  </div>
);

describe("ClickOutside", () => {
  it("renders and doesn't add an extra DOM element", () => {
    const { container } = render(
      <Wrapper onClickOutside={() => {}}>
        <Alert data-testid="child" type="success">
          Success
        </Alert>
      </Wrapper>
    );
    expect(screen.getByTestId("child")).toBeInTheDocument();
    expect(screen.getByTestId("outside")).toBeInTheDocument();
    const divs = container.querySelectorAll("div");
    expect(divs.length).toBe(3);
  });

  it("fires callback when click is outside", async () => {
    const callback = jest.fn();
    render(
      <Wrapper onClickOutside={callback}>
        <Alert data-testid="child" type="success">
          Success
        </Alert>
      </Wrapper>
    );
    const outsideTarget = screen.getByTestId("outside");
    await userEvent.click(outsideTarget);
    expect(callback).toHaveBeenCalledTimes(1);
  });

  it("does not fires callback when click is inside", async () => {
    const callback = jest.fn();
    render(
      <Wrapper onClickOutside={callback}>
        <Alert data-testid="child" type="success">
          Success
        </Alert>
      </Wrapper>
    );
    const alert = screen.getByTestId("child");
    await userEvent.click(alert);
    expect(callback).toHaveBeenCalledTimes(0);
  });
});
