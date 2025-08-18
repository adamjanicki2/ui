import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { Accordion, Alert } from "../../src";

const Wrapper = () => (
  <Accordion
    data-testid="accordion"
    drawers={[
      {
        label: "1",
        content: (
          <Alert type="info" data-testid="drawer-1">
            content
          </Alert>
        ),
      },
      {
        label: "2",
        content: (
          <Alert type="info" data-testid="drawer-2">
            content
          </Alert>
        ),
      },
    ]}
  />
);

describe("Accordion", () => {
  it("renders", () => {
    render(<Wrapper />);
    expect(screen.getByTestId("accordion")).toBeInTheDocument();
  });

  it("hides drawers visibly when not active", async () => {
    render(<Wrapper />);
    ["drawer-1", "drawer-2"].forEach((id) => {
      const child = screen.getByTestId(id);
      const animated = child.parentElement?.parentElement;
      expect(animated).toHaveStyle({ visibility: "hidden", height: 0 });
    });
  });

  it("shows drawers visibly when active", async () => {
    render(<Wrapper />);
    ["1", "2"].forEach(async (id) => {
      const button = screen.getByText(id);
      await userEvent.click(button);
      const child = screen.getByTestId(`drawer-${id}`);
      const animated = child.parentElement?.parentElement!;
      const style = getComputedStyle(animated);
      expect(style.height).toBeGreaterThan(0);
      expect(style.visibility).not.toBe("hidden");
      expect(style.opacity).toBe(1);
    });
  });
});
