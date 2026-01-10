import { act, fireEvent, render, screen } from "@testing-library/react";

import Tooltip from "../../src/components/Tooltip";

describe("Tooltip", () => {
  beforeAll(() => {
    if (window.PointerEvent) return;
    (window as any).PointerEvent = function PointerEvent(
      type: string,
      init?: MouseEventInit & { pointerType?: string }
    ) {
      const event = new MouseEvent(type, init);
      Object.defineProperty(event, "pointerType", { value: init?.pointerType });
      return event;
    };
  });

  it("opens on mouse hover and closes after leaving", async () => {
    render(
      <Tooltip anchor={<button type="button">Anchor</button>} duration={0}>
        Hello
      </Tooltip>
    );

    const anchor = screen.getByRole("button", { name: "Anchor" });

    fireEvent.pointerEnter(anchor, { pointerType: "mouse" });

    expect(screen.getByRole("tooltip")).toBeInTheDocument();
    expect(screen.getByText("Hello")).toBeInTheDocument();

    fireEvent.pointerLeave(anchor, { pointerType: "mouse" });

    await act(async () => {
      window.dispatchEvent(
        new PointerEvent("pointermove", {
          bubbles: true,
          cancelable: true,
          clientX: 100,
          clientY: 100,
          pointerType: "mouse",
        })
      );
    });

    expect(screen.queryByRole("tooltip")).not.toBeInTheDocument();
  });
});
