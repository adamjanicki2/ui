import { render, screen } from "@testing-library/react";
import React from "react";

import useClickOutside from "../../src/components/ClickOutside/useClickOutside";

const dispatchMouseDown = (el: Element) =>
  el.dispatchEvent(new MouseEvent("mousedown", { bubbles: true }));

const waitForHookToStart = async () =>
  new Promise((resolve) => window.setTimeout(resolve, 0));

describe("useClickOutside", () => {
  it("fires callback on mousedown outside targets", async () => {
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
    await waitForHookToStart();

    dispatchMouseDown(screen.getByTestId("outside"));
    expect(callback).toHaveBeenCalledTimes(1);
  });

  it("does not fire callback on mousedown inside a target", async () => {
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
    await waitForHookToStart();

    dispatchMouseDown(screen.getByTestId("target"));
    expect(callback).toHaveBeenCalledTimes(0);
  });

  it("treats any target as inside", async () => {
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
    await waitForHookToStart();

    dispatchMouseDown(screen.getByTestId("b"));
    dispatchMouseDown(screen.getByTestId("outside"));
    expect(callback).toHaveBeenCalledTimes(1);
  });

  it("does not fire when disabled", async () => {
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
    await waitForHookToStart();

    dispatchMouseDown(screen.getByTestId("outside"));
    expect(callback).toHaveBeenCalledTimes(0);
  });
});
