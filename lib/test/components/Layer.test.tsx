import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import React from "react";

import { Alert, Button, Layer } from "../../src";

type WrapperProps = {
  onClose: () => void;
  returnFocusOnEscape?: boolean;
  disableScrollLock?: boolean;
};

const Wrapper = ({
  onClose,
  returnFocusOnEscape,
  disableScrollLock,
}: WrapperProps) => (
  <Layer
    data-testid="layer"
    onClose={onClose}
    returnFocusOnEscape={returnFocusOnEscape}
    disableScrollLock={disableScrollLock}
  >
    <Alert data-testid="alert" type="success">
      <Button data-testid="button">Button</Button>
      Success
    </Alert>
  </Layer>
);

describe("Layer", () => {
  it("renders children", () => {
    render(<Wrapper onClose={() => {}} />);
    expect(screen.getByTestId("alert")).toBeInTheDocument();
  });

  it("fires onClose on Escape", async () => {
    const user = userEvent.setup();
    const callback = jest.fn();

    render(<Wrapper onClose={callback} />);
    await user.keyboard("{Escape}");

    expect(callback).toHaveBeenCalledTimes(1);
  });

  it("does not fire onClose on other keys", async () => {
    const user = userEvent.setup();
    const callback = jest.fn();

    render(<Wrapper onClose={callback} />);
    await user.keyboard("{Enter}");
    await user.keyboard("a");
    await user.keyboard("{ArrowDown}");

    expect(callback).toHaveBeenCalledTimes(0);
  });

  it("fires onClose when backdrop is clicked", async () => {
    const user = userEvent.setup();
    const callback = jest.fn();

    render(<Wrapper onClose={callback} />);
    await user.click(screen.getByTestId("layer"));

    expect(callback).toHaveBeenCalledTimes(1);
  });

  it("does not fire onClose when content is clicked", async () => {
    const user = userEvent.setup();
    const callback = jest.fn();

    render(<Wrapper onClose={callback} />);
    await user.click(screen.getByTestId("alert"));
    await user.click(screen.getByTestId("button"));
    expect(callback).toHaveBeenCalledTimes(0);
  });

  it("opening a nested layer does not close the first", async () => {
    const user = userEvent.setup();
    const parentOnClose = jest.fn();
    const nestedOnClose = jest.fn();

    const Nested = () => {
      const [nestedOpen, setNestedOpen] = React.useState(false);

      return (
        <Layer data-testid="parent-layer" onClose={parentOnClose}>
          <Alert data-testid="parent-content" type="success">
            <button
              data-testid="open-nested"
              onClick={() => setNestedOpen(true)}
            >
              Open nested
            </button>

            {nestedOpen ? (
              <Layer data-testid="nested-layer" onClose={nestedOnClose}>
                <Alert data-testid="nested-content" type="success">
                  Nested
                </Alert>
              </Layer>
            ) : null}
          </Alert>
        </Layer>
      );
    };

    render(<Nested />);
    await user.click(screen.getByTestId("open-nested"));
    expect(parentOnClose).toHaveBeenCalledTimes(0);
    expect(screen.getByTestId("nested-layer")).toBeInTheDocument();
    expect(screen.getByTestId("nested-content")).toBeInTheDocument();
  });

  it("clicking nested backdrop closes nested layer but not main", async () => {
    const user = userEvent.setup();
    const parentOnClose = jest.fn();
    const nestedOnClose = jest.fn();

    const Nested = () => (
      <Layer data-testid="parent-layer" onClose={parentOnClose}>
        <Alert data-testid="parent-content" type="success">
          <Layer data-testid="nested-layer" onClose={nestedOnClose}>
            <Alert data-testid="nested-content" type="success">
              Nested
            </Alert>
          </Layer>
        </Alert>
      </Layer>
    );

    render(<Nested />);

    await user.click(screen.getByTestId("nested-layer"));

    expect(nestedOnClose).toHaveBeenCalledTimes(1);
    expect(parentOnClose).toHaveBeenCalledTimes(0);
  });
});
