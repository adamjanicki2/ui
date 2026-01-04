import { render, screen, waitFor } from "@testing-library/react";
import Floating from "../../src/components/Floating";

const rect = (r: Partial<DOMRect>): DOMRect =>
  ({
    x: 0,
    y: 0,
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    width: 0,
    height: 0,
    ...r,
  } as DOMRect);

describe("Floating", () => {
  beforeEach(() => {
    window.innerWidth = 1000;
    window.innerHeight = 600;
  });

  afterEach(jest.restoreAllMocks);

  it("centers content under the anchor by default", () => {
    jest
      .spyOn(HTMLElement.prototype, "getBoundingClientRect")
      .mockImplementation(function (this: HTMLElement) {
        const testId = this.getAttribute("data-testid");
        if (testId === "anchor") {
          return rect({
            top: 100,
            left: 200,
            width: 100,
            height: 20,
            right: 300,
            bottom: 120,
          });
        }
        if (testId === "floating") {
          return rect({
            width: 80,
            height: 40,
          });
        }
        return rect({});
      });

    render(
      <Floating
        data-testid="floating"
        anchor={<button data-testid="anchor">Anchor</button>}
        floatingContent={<div>Content</div>}
        visible
      />
    );

    const floating = screen.getByTestId("floating");
    expect(floating).toHaveClass("aui-pos-fixed");
    expect(floating).toHaveClass("aui-z-floating");
    expect(floating).toHaveStyle({ top: "120px", left: "210px" });
  });

  it("flips from bottom to top when bottom would overflow viewport", () => {
    jest
      .spyOn(HTMLElement.prototype, "getBoundingClientRect")
      .mockImplementation(function (this: HTMLElement) {
        const testId = this.getAttribute("data-testid");
        if (testId === "anchor") {
          return rect({
            top: 580,
            left: 100,
            width: 60,
            height: 20,
            right: 160,
            bottom: 600,
          });
        }
        if (testId === "floating") {
          return rect({
            width: 100,
            height: 60,
          });
        }
        return rect({});
      });

    render(
      <Floating
        data-testid="floating"
        anchor={<div data-testid="anchor">Anchor</div>}
        floatingContent={<div>Content</div>}
        placement="bottom-end"
        visible
      />
    );

    const floating = screen.getByTestId("floating");
    expect(floating).toHaveStyle({ top: "520px", left: "60px" });
  });

  it("supports bottom-start placement", () => {
    jest
      .spyOn(HTMLElement.prototype, "getBoundingClientRect")
      .mockImplementation(function (this: HTMLElement) {
        const testId = this.getAttribute("data-testid");
        if (testId === "anchor") {
          return rect({
            top: 100,
            left: 200,
            width: 100,
            height: 20,
            right: 300,
            bottom: 120,
          });
        }
        if (testId === "floating") {
          return rect({
            width: 80,
            height: 40,
          });
        }
        return rect({});
      });

    render(
      <Floating
        data-testid="floating"
        anchor={<button data-testid="anchor">Anchor</button>}
        floatingContent={<div>Content</div>}
        placement="bottom-start"
        visible
      />
    );

    const floating = screen.getByTestId("floating");
    expect(floating).toHaveStyle({ top: "120px", left: "200px" });
  });

  it("supports right-end placement", () => {
    jest
      .spyOn(HTMLElement.prototype, "getBoundingClientRect")
      .mockImplementation(function (this: HTMLElement) {
        const testId = this.getAttribute("data-testid");
        if (testId === "anchor") {
          return rect({
            top: 100,
            left: 200,
            width: 100,
            height: 20,
            right: 300,
            bottom: 120,
          });
        }
        if (testId === "floating") {
          return rect({
            width: 80,
            height: 40,
          });
        }
        return rect({});
      });

    render(
      <Floating
        data-testid="floating"
        anchor={<button data-testid="anchor">Anchor</button>}
        floatingContent={<div>Content</div>}
        placement="right-end"
        visible
      />
    );

    const floating = screen.getByTestId("floating");
    expect(floating).toHaveStyle({ top: "80px", left: "300px" });
  });

  it("supports top-end placement", () => {
    jest
      .spyOn(HTMLElement.prototype, "getBoundingClientRect")
      .mockImplementation(function (this: HTMLElement) {
        const testId = this.getAttribute("data-testid");
        if (testId === "anchor") {
          return rect({
            top: 100,
            left: 200,
            width: 100,
            height: 20,
            right: 300,
            bottom: 120,
          });
        }
        if (testId === "floating") {
          return rect({
            width: 80,
            height: 40,
          });
        }
        return rect({});
      });

    render(
      <Floating
        data-testid="floating"
        anchor={<button data-testid="anchor">Anchor</button>}
        floatingContent={<div>Content</div>}
        placement="top-end"
        visible
      />
    );

    const floating = screen.getByTestId("floating");
    expect(floating).toHaveStyle({ top: "60px", left: "220px" });
  });

  it("applies offset", () => {
    jest
      .spyOn(HTMLElement.prototype, "getBoundingClientRect")
      .mockImplementation(function (this: HTMLElement) {
        const testId = this.getAttribute("data-testid");
        if (testId === "anchor") {
          return rect({
            top: 10,
            left: 20,
            width: 100,
            height: 20,
            right: 120,
            bottom: 30,
          });
        }
        if (testId === "floating") {
          return rect({
            width: 80,
            height: 40,
          });
        }
        return rect({});
      });

    render(
      <Floating
        data-testid="floating"
        anchor={<button data-testid="anchor">Anchor</button>}
        floatingContent={<div>Content</div>}
        offset={12}
        placement="bottom"
        visible
      />
    );

    const floating = screen.getByTestId("floating");
    expect(floating).toHaveStyle({ top: "42px" });
  });

  it("does not render when visible is false", () => {
    render(
      <Floating
        data-testid="floating"
        anchor={<button data-testid="anchor">Anchor</button>}
        floatingContent={<div>Content</div>}
        visible={false}
      />
    );

    expect(screen.queryByTestId("floating")).not.toBeInTheDocument();
  });

  it("positions on mount without needing scroll", async () => {
    const seen = new Set<string | null>();

    jest
      .spyOn(HTMLElement.prototype, "getBoundingClientRect")
      .mockImplementation(function (this: HTMLElement) {
        const testId = this.getAttribute("data-testid");
        seen.add(testId);

        if (testId === "anchor") {
          return rect({
            top: 10,
            left: 20,
            width: 100,
            height: 20,
            right: 120,
            bottom: 30,
          });
        }
        if (testId === "floating") {
          return rect({ width: 80, height: 40 });
        }
        return rect({});
      });

    render(
      <Floating
        data-testid="floating"
        anchor={<button data-testid="anchor">Anchor</button>}
        floatingContent={<div>Content</div>}
        visible
      />
    );

    await waitFor(() => {
      expect(seen.has("floating")).toBe(true);
      expect(screen.getByTestId("floating")).toHaveStyle({
        top: "30px",
        left: "30px",
      });
    });
  });
});
