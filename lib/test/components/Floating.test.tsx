import { render, screen } from "@testing-library/react";
import Floating from "../../src/components/Floating";

type Rect = Omit<DOMRect, "toJSON">;

const rect = (r: Partial<Rect>): DOMRect =>
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
    toJSON: () => ({}),
  } as DOMRect);

describe("Floating", () => {
  beforeEach(() => {
    Object.defineProperty(window, "innerWidth", {
      value: 1000,
      writable: true,
    });
    Object.defineProperty(window, "innerHeight", {
      value: 600,
      writable: true,
    });
  });

  afterEach(() => {
    jest.restoreAllMocks();
  });

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
      />
    );

    const floating = screen.getByTestId("floating");
    expect(floating).toHaveStyle({ top: "520px" });
  });
});
