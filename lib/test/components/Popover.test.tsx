import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import Popover from "../../src/components/Popover";

const dispatchPointerDown = (el: Element) =>
  el.dispatchEvent(new Event("pointerdown", { bubbles: true }));

describe("Popover", () => {
  it("fires onClose when pointerdown is outside anchor and content", async () => {
    const onClose = jest.fn();

    render(
      <div>
        <button data-testid="outside">Outside</button>
        <Popover
          open
          onClose={onClose}
          anchor={<button data-testid="anchor">Anchor</button>}
        >
          <div data-testid="content">Content</div>
        </Popover>
      </div>
    );

    // useClickOutside waits a tick before activating to avoid firing on mount
    await new Promise((resolve) => window.setTimeout(resolve, 0));

    dispatchPointerDown(screen.getByTestId("outside"));
    expect(onClose).toHaveBeenCalledTimes(1);
  });

  it("does not fire onClose when pointerdown is inside anchor", () => {
    const onClose = jest.fn();

    render(
      <Popover
        open
        onClose={onClose}
        anchor={<button data-testid="anchor">Anchor</button>}
      >
        <div data-testid="content">Content</div>
      </Popover>
    );

    dispatchPointerDown(screen.getByTestId("anchor"));
    expect(onClose).toHaveBeenCalledTimes(0);
  });

  it("does not fire onClose when pointerdown is inside content", () => {
    const onClose = jest.fn();

    render(
      <Popover
        open
        onClose={onClose}
        anchor={<button data-testid="anchor">Anchor</button>}
      >
        <div data-testid="content">Content</div>
      </Popover>
    );

    dispatchPointerDown(screen.getByTestId("content"));
    expect(onClose).toHaveBeenCalledTimes(0);
  });

  it("fires onClose on escape", async () => {
    const user = userEvent.setup();
    const onClose = jest.fn();

    render(
      <Popover
        open
        onClose={onClose}
        anchor={<button data-testid="anchor">Anchor</button>}
      >
        <div data-testid="content">Content</div>
      </Popover>
    );

    await user.keyboard("{Escape}");
    expect(onClose).toHaveBeenCalledTimes(1);
  });

  it("closes all open popovers on escape", async () => {
    const user = userEvent.setup();
    const onClose1 = jest.fn();
    const onClose2 = jest.fn();

    render(
      <div>
        <Popover
          open
          onClose={onClose1}
          anchor={<button data-testid="anchor1">Anchor 1</button>}
        >
          <div>Content 1</div>
        </Popover>
        <Popover
          open
          onClose={onClose2}
          anchor={<button data-testid="anchor2">Anchor 2</button>}
        >
          <div>Content 2</div>
        </Popover>
      </div>
    );

    await user.keyboard("{Escape}");
    expect(onClose1).toHaveBeenCalledTimes(1);
    expect(onClose2).toHaveBeenCalledTimes(1);
  });
});
