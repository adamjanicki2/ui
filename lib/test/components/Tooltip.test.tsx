import { act, render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import Tooltip from "../../src/components/Tooltip";

describe("Tooltip", () => {
  it("shows on hover and hides after pointer leaves the safe area", async () => {
    const user = userEvent.setup();

    render(
      <Tooltip tooltipContent="Hello tooltip">
        <button type="button">Hover</button>
      </Tooltip>
    );

    expect(screen.queryByRole("tooltip")).not.toBeInTheDocument();

    await user.hover(screen.getByRole("button", { name: "Hover" }));
    expect(screen.getByRole("tooltip")).toBeInTheDocument();
    expect(screen.getByText("Hello tooltip")).toBeInTheDocument();

    await user.unhover(screen.getByRole("button", { name: "Hover" }));
    await act(async () =>
      window.dispatchEvent(
        new MouseEvent("pointermove", { clientX: 100, clientY: 100 })
      )
    );
    expect(screen.queryByRole("tooltip")).not.toBeInTheDocument();
  });

  it("stays open when moving from anchor into tooltip", async () => {
    const user = userEvent.setup();

    render(
      <Tooltip tooltipContent="Hello tooltip">
        <button type="button">Hover</button>
      </Tooltip>
    );

    const button = screen.getByRole("button", { name: "Hover" });

    await user.hover(button);
    const tooltip = screen.getByRole("tooltip");

    await user.unhover(button);
    await user.hover(tooltip);

    expect(screen.getByRole("tooltip")).toBeInTheDocument();

    await user.unhover(tooltip);
    await act(async () => {
      window.dispatchEvent(
        new MouseEvent("pointermove", { clientX: 100, clientY: 100 })
      );
    });
    expect(screen.queryByRole("tooltip")).not.toBeInTheDocument();
  });

  it("does not show when disabled", async () => {
    const user = userEvent.setup();

    render(
      <Tooltip disabled tooltipContent="Hello tooltip">
        <button type="button">Hover</button>
      </Tooltip>
    );

    await user.hover(screen.getByRole("button", { name: "Hover" }));
    expect(screen.queryByRole("tooltip")).not.toBeInTheDocument();
  });
});
