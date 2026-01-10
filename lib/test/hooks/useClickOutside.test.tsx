import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import React from "react";

import useClickOutside from "../../src/components/ClickOutside/useClickOutside";

describe("useClickOutside", () => {
  it("fires callback on mousedown outside targets", async () => {
    const user = userEvent.setup();
    const callback = jest.fn();

    const Wrapper = () => {
      const target = React.useRef<HTMLDivElement | null>(null);
      useClickOutside({
        targets: [target],
        onClickOutside: callback,
      });
      return (
        <div>
          <div data-testid="target" ref={target} />
          <button data-testid="outside">Outside</button>
        </div>
      );
    };

    render(<Wrapper />);

    await user.click(screen.getByTestId("outside"));
    expect(callback).toHaveBeenCalledTimes(1);
  });

  it("does not fire callback on mousedown inside a target", async () => {
    const user = userEvent.setup();
    const callback = jest.fn();

    const Wrapper = () => {
      const target = React.useRef<HTMLDivElement | null>(null);
      useClickOutside({
        targets: [target],
        onClickOutside: callback,
      });
      return (
        <div>
          <div data-testid="target" ref={target} />
        </div>
      );
    };

    render(<Wrapper />);

    await user.click(screen.getByTestId("target"));
    expect(callback).toHaveBeenCalledTimes(0);
  });

  it("treats any target as inside", async () => {
    const user = userEvent.setup();
    const callback = jest.fn();

    const Wrapper = () => {
      const a = React.useRef<HTMLDivElement | null>(null);
      const b = React.useRef<HTMLDivElement | null>(null);
      useClickOutside({
        targets: [a, b],
        onClickOutside: callback,
      });
      return (
        <div>
          <div data-testid="a" ref={a} />
          <div data-testid="b" ref={b} />
          <button data-testid="outside">Outside</button>
        </div>
      );
    };

    render(<Wrapper />);

    await user.click(screen.getByTestId("b"));
    await user.click(screen.getByTestId("outside"));

    expect(callback).toHaveBeenCalledTimes(1);
  });

  it("does not fire when disabled", async () => {
    const user = userEvent.setup();
    const callback = jest.fn();

    const Wrapper = () => {
      const target = React.useRef<HTMLDivElement | null>(null);
      useClickOutside({
        targets: [target],
        enabled: false,
        onClickOutside: callback,
      });
      return (
        <div>
          <div data-testid="target" ref={target} />
          <button data-testid="outside">Outside</button>
        </div>
      );
    };

    render(<Wrapper />);

    await user.click(screen.getByTestId("outside"));
    expect(callback).toHaveBeenCalledTimes(0);
  });
});
