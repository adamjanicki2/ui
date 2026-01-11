import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import React from "react";

import { useFocusTrap } from "../../src/";

const Trap = ({
  active = true,
  testId = "trap",
  children,
}: {
  active?: boolean;
  testId?: string;
  children?: React.ReactNode;
}) => {
  const ref = useFocusTrap<HTMLDivElement>(active);

  return (
    <div data-testid={testId} ref={ref}>
      {children}
    </div>
  );
};

describe("useFocusTrap", () => {
  it("tab on last focuses first", async () => {
    const user = userEvent.setup();

    render(
      <Trap>
        <button data-testid="first">First</button>
        <button data-testid="last">Last</button>
      </Trap>
    );

    const first = screen.getByTestId("first");
    const last = screen.getByTestId("last");

    last.focus();
    expect(document.activeElement).toBe(last);

    await user.keyboard("{Tab}");

    expect(document.activeElement).toBe(first);
  });

  it("shift+tab on first focuses last", async () => {
    const user = userEvent.setup();

    render(
      <Trap>
        <button data-testid="first">First</button>
        <button data-testid="last">Last</button>
      </Trap>
    );

    const first = screen.getByTestId("first");
    const last = screen.getByTestId("last");

    first.focus();
    expect(document.activeElement).toBe(first);

    await user.keyboard("{Shift>}{Tab}{/Shift}");

    expect(document.activeElement).toBe(last);
  });

  it("prevents default when there are no focusable elements", () => {
    render(
      <Trap>
        <div data-testid="content">No focusables</div>
      </Trap>
    );

    const trap = screen.getByTestId("trap");

    const ev = new KeyboardEvent("keydown", {
      key: "Tab",
      bubbles: true,
      cancelable: true,
    });

    trap.dispatchEvent(ev);

    expect(ev.defaultPrevented).toBe(true);
  });

  it("does nothing when inactive", () => {
    render(
      <Trap active={false}>
        <button data-testid="first">First</button>
        <button data-testid="last">Last</button>
      </Trap>
    );

    const trap = screen.getByTestId("trap");

    const ev = new KeyboardEvent("keydown", {
      key: "Tab",
      bubbles: true,
      cancelable: true,
    });

    trap.dispatchEvent(ev);

    expect(ev.defaultPrevented).toBe(false);
  });

  it("only the top-most trap handles tab", async () => {
    const user = userEvent.setup();

    render(
      <Trap testId="outer">
        <button data-testid="outer-first">Outer First</button>
        <button data-testid="outer-last">Outer Last</button>

        <Trap testId="inner">
          <button data-testid="inner-first">Inner First</button>
          <button data-testid="inner-last">Inner Last</button>
        </Trap>
      </Trap>
    );

    const outerFirst = screen.getByTestId("outer-first");
    const innerFirst = screen.getByTestId("inner-first");
    const innerLast = screen.getByTestId("inner-last");

    innerLast.focus();
    expect(document.activeElement).toBe(innerLast);

    await user.keyboard("{Tab}");

    expect(document.activeElement).toBe(innerFirst);
    expect(document.activeElement).not.toBe(outerFirst);
  });
});
