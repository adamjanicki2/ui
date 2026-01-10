import { act, render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import React from "react";

import Popover from "../../src/components/Popover";

const flushEffects = async () => {
  await act(async () => {});
};

const renderPopover = (opts?: {
  onClose?: jest.Mock;
  includeOutside?: boolean;
  content?: React.ReactNode;
  anchorTestId?: string;
}) => {
  const onClose = opts?.onClose ?? jest.fn();
  const anchorTestId = opts?.anchorTestId ?? "anchor";

  render(
    <div>
      {opts?.includeOutside && <button data-testid="outside">Outside</button>}
      <Popover
        open
        onClose={onClose}
        anchor={<button data-testid={anchorTestId}>Anchor</button>}
      >
        {opts?.content ?? <div data-testid="content">Content</div>}
      </Popover>
    </div>
  );

  return { onClose };
};

describe("Popover", () => {
  it("fires onClose when mousedown is outside anchor and content", async () => {
    const user = userEvent.setup();
    const onClose = jest.fn();

    renderPopover({ onClose, includeOutside: true });
    await flushEffects();

    await user.pointer([
      { target: screen.getByTestId("outside"), keys: "[MouseLeft]" },
    ]);

    expect(onClose).toHaveBeenCalledTimes(1);
  });

  it("does not fire onClose when mousedown is inside anchor", async () => {
    const user = userEvent.setup();
    const onClose = jest.fn();

    renderPopover({ onClose });

    await user.pointer([
      { target: screen.getByTestId("anchor"), keys: "[MouseLeft]" },
    ]);

    expect(onClose).toHaveBeenCalledTimes(0);
  });

  it("does not fire onClose when mousedown is inside content", async () => {
    const user = userEvent.setup();
    const onClose = jest.fn();

    renderPopover({ onClose });

    await user.pointer([
      { target: screen.getByTestId("content"), keys: "[MouseLeft]" },
    ]);

    expect(onClose).toHaveBeenCalledTimes(0);
  });

  it("fires onClose on escape", async () => {
    const user = userEvent.setup();
    const onClose = jest.fn();

    renderPopover({ onClose });

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
