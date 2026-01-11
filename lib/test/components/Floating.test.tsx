import { render, screen, waitFor } from "@testing-library/react";
import React from "react";

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
  }) as DOMRect;

const setViewport = ({
  width = 1000,
  height = 600,
  scrollX = 0,
  scrollY = 0,
}: {
  width?: number;
  height?: number;
  scrollX?: number;
  scrollY?: number;
}) => {
  window.innerWidth = width;
  window.innerHeight = height;
  window.scrollX = scrollX;
  window.scrollY = scrollY;
};

type RectImpl =
  | Record<string, Partial<DOMRect>>
  | ((testId: string | null, el: HTMLElement) => Partial<DOMRect> | null);

const mockRects = (impl: RectImpl) =>
  jest
    .spyOn(HTMLElement.prototype, "getBoundingClientRect")
    .mockImplementation(function (this: HTMLElement) {
      const testId = this.getAttribute("data-testid");
      const partial =
        typeof impl === "function"
          ? impl(testId, this)
          : (impl[testId ?? ""] ?? null);

      return rect(partial ?? {});
    });

const renderFloating = (
  props: Partial<React.ComponentProps<typeof Floating>> & {
    visible: boolean;
  }
) =>
  render(
    <Floating
      data-testid="floating"
      anchor={<button data-testid="anchor">Anchor</button>}
      floating={<div>Content</div>}
      {...props}
    />
  );

describe("Floating", () => {
  beforeEach(() => {
    setViewport({});
  });

  afterEach(() => {
    jest.restoreAllMocks();
  });

  it("uses bottom placement by default and uses offset", () => {
    mockRects({
      anchor: {
        top: 100,
        left: 200,
        width: 100,
        height: 20,
        right: 300,
        bottom: 120,
      },
      floating: { width: 80, height: 40 },
    });

    renderFloating({ visible: true, offset: 8 });

    const floating = screen.getByTestId("floating");
    expect(floating).toHaveClass("aui-pos-absolute", "aui-z-floating");
    expect(floating).toHaveStyle({ transform: "translate3d(210px, 128px, 0)" });
  });

  it("does not render when visible is false", () => {
    renderFloating({ visible: false });
    expect(screen.queryByTestId("floating")).not.toBeInTheDocument();
  });

  it("positions on mount without needing scroll", async () => {
    const seen = new Set<string | null>();

    mockRects((testId) => {
      seen.add(testId);
      if (testId === "anchor") {
        return {
          top: 10,
          left: 20,
          width: 100,
          height: 20,
          right: 120,
          bottom: 30,
        };
      }
      if (testId === "floating") return { width: 80, height: 40 };
      return {};
    });

    renderFloating({ visible: true });

    await waitFor(() => {
      expect(seen.has("floating")).toBe(true);
      expect(screen.getByTestId("floating")).toHaveStyle({
        transform: "translate3d(30px, 30px, 0)",
      });
    });
  });

  it("flips from bottom to top when bottom would overflow viewport", () => {
    mockRects({
      anchor: {
        top: 580,
        left: 100,
        width: 60,
        height: 20,
        right: 160,
        bottom: 600,
      },
      floating: { width: 100, height: 60 },
    });

    render(
      <Floating
        data-testid="floating"
        anchor={<div data-testid="anchor">Anchor</div>}
        floating={<div>Content</div>}
        placement="bottom-end"
        visible
        flip
      />
    );

    expect(screen.getByTestId("floating")).toHaveStyle({
      transform: "translate3d(60px, 520px, 0)",
    });
  });

  it("does not flip when flip is false even if it would overflow", () => {
    mockRects({
      anchor: {
        top: 580,
        left: 100,
        width: 60,
        height: 20,
        right: 160,
        bottom: 600,
      },
      floating: { width: 100, height: 60 },
    });

    render(
      <Floating
        data-testid="floating"
        anchor={<div data-testid="anchor">Anchor</div>}
        floating={<div>Content</div>}
        placement="bottom-end"
        flip={false}
        visible
      />
    );

    expect(screen.getByTestId("floating")).toHaveStyle({
      transform: "translate3d(60px, 600px, 0)",
    });
  });

  it("does not flip if the opposite placement also overflows", () => {
    setViewport({ height: 100 });

    mockRects({
      anchor: {
        top: 40,
        left: 100,
        width: 50,
        height: 20,
        right: 150,
        bottom: 60,
      },
      floating: { width: 80, height: 200 },
    });

    renderFloating({ visible: true, placement: "bottom" });

    expect(screen.getByTestId("floating")).toHaveStyle({
      transform: "translate3d(85px, 60px, 0)",
    });
  });

  it("positions correctly when offsetParent is null and window is scrolled", async () => {
    setViewport({ scrollX: 50, scrollY: 400 });

    jest
      .spyOn(HTMLElement.prototype, "offsetParent", "get")
      .mockReturnValue(null);

    mockRects((testId) => {
      if (testId === "anchor") {
        return {
          top: 200,
          left: 300,
          width: 100,
          height: 20,
          right: 400,
          bottom: 220,
        };
      }
      if (testId === "floating") return { width: 80, height: 40 };
      return {};
    });

    renderFloating({ visible: true, placement: "bottom-start" });

    await waitFor(() => {
      expect(screen.getByTestId("floating")).toHaveStyle({
        transform: "translate3d(350px, 620px, 0)",
      });
    });
  });

  it("adds/removes resize and scroll listeners only while visible", () => {
    const addWin = jest.spyOn(window, "addEventListener");
    const remWin = jest.spyOn(window, "removeEventListener");
    const addDoc = jest.spyOn(document, "addEventListener");
    const remDoc = jest.spyOn(document, "removeEventListener");

    mockRects({
      anchor: {
        top: 10,
        left: 10,
        width: 50,
        height: 20,
        right: 60,
        bottom: 30,
      },
      floating: { width: 80, height: 40 },
    });

    const { rerender, unmount } = renderFloating({
      visible: false,
      flip: true,
    });

    expect(addWin).not.toHaveBeenCalled();
    expect(addDoc).not.toHaveBeenCalled();

    rerender(
      <Floating
        data-testid="floating"
        anchor={<button data-testid="anchor">Anchor</button>}
        floating={<div>Content</div>}
        visible
        flip
      />
    );

    expect(addWin).toHaveBeenCalledWith("resize", expect.any(Function));
    expect(addDoc).toHaveBeenCalledWith("scroll", expect.any(Function), true);
    unmount();
    expect(remWin).toHaveBeenCalledWith("resize", expect.any(Function));
    expect(remDoc).toHaveBeenCalledWith("scroll", expect.any(Function), true);
  });
});
