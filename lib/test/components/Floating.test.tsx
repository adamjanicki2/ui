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
  }) as DOMRect;

describe("Floating", () => {
  beforeEach(() => {
    // define props needed by floating
    window.innerWidth = 1000;
    window.innerHeight = 600;
    window.scrollX = 0;
    window.scrollY = 0;
  });

  afterEach(() => {
    jest.restoreAllMocks();
  });

  function mockBoundingClientRect(
    impl:
      | Record<string, Partial<DOMRect>>
      | ((testId: string | null, el: HTMLElement) => Partial<DOMRect> | null)
  ) {
    return jest
      .spyOn(HTMLElement.prototype, "getBoundingClientRect")
      .mockImplementation(function (this: HTMLElement) {
        const testId = this.getAttribute("data-testid");
        const partial =
          typeof impl === "function"
            ? impl(testId, this)
            : (impl[testId ?? ""] ?? null);
        return rect(partial ?? {});
      });
  }

  it("uses bottom placement by default and uses offset", () => {
    mockBoundingClientRect({
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

    render(
      <Floating
        data-testid="floating"
        anchor={<button data-testid="anchor">Anchor</button>}
        floating={<div>Content</div>}
        visible
        offset={8}
      />
    );

    const floating = screen.getByTestId("floating");
    expect(floating).toHaveClass("aui-pos-absolute");
    expect(floating).toHaveClass("aui-z-floating");
    expect(floating).toHaveStyle({ transform: "translate3d(210px, 128px, 0)" });
  });

  it("does not render when visible is false", () => {
    render(
      <Floating
        data-testid="floating"
        anchor={<button data-testid="anchor">Anchor</button>}
        floating={<div>Content</div>}
        visible={false}
      />
    );

    expect(screen.queryByTestId("floating")).not.toBeInTheDocument();
  });

  it("positions on mount without needing scroll", async () => {
    const seen = new Set<string | null>();

    mockBoundingClientRect((testId) => {
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

    render(
      <Floating
        data-testid="floating"
        anchor={<button data-testid="anchor">Anchor</button>}
        floating={<div>Content</div>}
        visible
      />
    );

    await waitFor(() => {
      expect(seen.has("floating")).toBe(true);
      expect(screen.getByTestId("floating")).toHaveStyle({
        transform: "translate3d(30px, 30px, 0)",
      });
    });
  });

  it("flips from bottom to top when bottom would overflow viewport", () => {
    mockBoundingClientRect({
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
    mockBoundingClientRect({
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
    window.innerHeight = 100;

    mockBoundingClientRect({
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

    render(
      <Floating
        data-testid="floating"
        anchor={<div data-testid="anchor">Anchor</div>}
        floating={<div>Content</div>}
        placement="bottom"
        visible
      />
    );

    expect(screen.getByTestId("floating")).toHaveStyle({
      transform: "translate3d(85px, 60px, 0)",
    });
  });

  it("positions correctly when offsetParent is null and window is scrolled", async () => {
    window.scrollY = 400;
    window.scrollX = 50;

    jest
      .spyOn(HTMLElement.prototype as any, "offsetParent", "get")
      .mockReturnValue(null);

    mockBoundingClientRect((testId) => {
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

    render(
      <Floating
        data-testid="floating"
        anchor={<button data-testid="anchor">Anchor</button>}
        floating={<div>Content</div>}
        placement="bottom-start"
        visible
      />
    );

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

    mockBoundingClientRect({
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

    const { rerender, unmount } = render(
      <Floating
        data-testid="floating"
        anchor={<button data-testid="anchor">Anchor</button>}
        floating={<div>Content</div>}
        visible={false}
        flip
      />
    );

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
