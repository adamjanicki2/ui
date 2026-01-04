import { render, screen } from "@testing-library/react";
import React from "react";
import useClickOutside from "../../src/components/ClickOutside/useClickOutside";

const dispatchPointerDown = (el: Element) =>
  el.dispatchEvent(new Event("pointerdown", { bubbles: true }));

const waitForHookToStart = async () =>
  new Promise((resolve) => window.setTimeout(resolve, 0));

describe("useClickOutside", () => {
  it("fires callback on pointerdown outside targets", async () => {
    const callback = jest.fn();

    const Wrapper = () => {
      const [target, setTarget] = React.useState<HTMLDivElement | null>(null);
      useClickOutside({
        targets: [target],
        eventType: "pointerdown",
        onClickOutside: callback,
      });
      return (
        <div>
          <div data-testid="target" ref={setTarget} />
          <button data-testid="outside">Outside</button>
        </div>
      );
    };

    render(<Wrapper />);
    await waitForHookToStart();

    dispatchPointerDown(screen.getByTestId("outside"));
    expect(callback).toHaveBeenCalledTimes(1);
  });

  it("does not fire callback on pointerdown inside a target", async () => {
    const callback = jest.fn();

    const Wrapper = () => {
      const [target, setTarget] = React.useState<HTMLDivElement | null>(null);
      useClickOutside({
        targets: [target],
        eventType: "pointerdown",
        onClickOutside: callback,
      });
      return (
        <div>
          <div data-testid="target" ref={setTarget} />
        </div>
      );
    };

    render(<Wrapper />);
    await waitForHookToStart();

    dispatchPointerDown(screen.getByTestId("target"));
    expect(callback).toHaveBeenCalledTimes(0);
  });

  it("treats any target as inside", async () => {
    const callback = jest.fn();

    const Wrapper = () => {
      const [a, setA] = React.useState<HTMLDivElement | null>(null);
      const [b, setB] = React.useState<HTMLDivElement | null>(null);
      useClickOutside({
        targets: [a, b],
        eventType: "pointerdown",
        onClickOutside: callback,
      });
      return (
        <div>
          <div data-testid="a" ref={setA} />
          <div data-testid="b" ref={setB} />
          <button data-testid="outside">Outside</button>
        </div>
      );
    };

    render(<Wrapper />);
    await waitForHookToStart();

    dispatchPointerDown(screen.getByTestId("b"));
    dispatchPointerDown(screen.getByTestId("outside"));
    expect(callback).toHaveBeenCalledTimes(1);
  });

  it("does not fire when disabled", async () => {
    const callback = jest.fn();

    const Wrapper = () => {
      const [target, setTarget] = React.useState<HTMLDivElement | null>(null);
      useClickOutside({
        targets: [target],
        enabled: false,
        eventType: "pointerdown",
        onClickOutside: callback,
      });
      return (
        <div>
          <div data-testid="target" ref={setTarget} />
          <button data-testid="outside">Outside</button>
        </div>
      );
    };

    render(<Wrapper />);
    await waitForHookToStart();

    dispatchPointerDown(screen.getByTestId("outside"));
    expect(callback).toHaveBeenCalledTimes(0);
  });
});

