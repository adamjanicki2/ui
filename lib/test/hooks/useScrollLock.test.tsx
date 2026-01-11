import { render, waitFor } from "@testing-library/react";

import { useScrollLock } from "../../src";

const setScrollY = (y: number) => {
  Object.defineProperty(window, "scrollY", {
    value: y,
    writable: true,
    configurable: true,
  });
};

describe("useScrollLock", () => {
  const originalScrollTo = window.scrollTo;

  beforeEach(() => {
    jest.resetModules();

    document.body.style.overflow = "";
    document.body.style.position = "";
    document.body.style.top = "";
    document.body.style.width = "";

    setScrollY(0);
    window.scrollTo = jest.fn();
  });

  afterEach(() => {
    window.scrollTo = originalScrollTo;
  });

  it("locks scroll on mount by default and sets fixed-body styles", async () => {
    setScrollY(123);

    const Wrapper = () => {
      useScrollLock();
      return <div />;
    };

    const { unmount } = render(<Wrapper />);

    await waitFor(() => {
      expect(document.body.style.overflow).toBe("hidden");
      expect(document.body.style.position).toBe("fixed");
      expect(document.body.style.top).toBe("-123px");
      expect(document.body.style.width).toBe("100%");
    });

    unmount();

    await waitFor(() => {
      expect(document.body.style.overflow).toBe("");
      expect(document.body.style.position).toBe("");
      expect(document.body.style.top).toBe("");
      expect(document.body.style.width).toBe("");
    });

    expect(window.scrollTo).toHaveBeenCalledTimes(1);
    expect(window.scrollTo).toHaveBeenCalledWith({
      top: 123,
      left: 0,
      behavior: "instant",
    });
  });

  it("does not lock when enable is false", async () => {
    setScrollY(50);

    const Wrapper = () => {
      useScrollLock(false);
      return <div />;
    };

    render(<Wrapper />);

    await waitFor(() => {
      expect(document.body.style.overflow).toBe("");
      expect(document.body.style.position).toBe("");
      expect(document.body.style.top).toBe("");
      expect(document.body.style.width).toBe("");
    });

    expect(window.scrollTo).toHaveBeenCalledTimes(0);
  });

  it("unlocks when enable changes from true -> false", async () => {
    setScrollY(200);

    const Wrapper = ({ enable }: { enable: boolean }) => {
      useScrollLock(enable);
      return <div />;
    };

    const { rerender } = render(<Wrapper enable={true} />);

    await waitFor(() => {
      expect(document.body.style.overflow).toBe("hidden");
      expect(document.body.style.top).toBe("-200px");
    });

    rerender(<Wrapper enable={false} />);

    await waitFor(() => {
      expect(document.body.style.overflow).toBe("");
      expect(document.body.style.position).toBe("");
      expect(document.body.style.top).toBe("");
      expect(document.body.style.width).toBe("");
    });

    expect(window.scrollTo).toHaveBeenCalledTimes(1);
    expect(window.scrollTo).toHaveBeenCalledWith({
      top: 200,
      left: 0,
      behavior: "instant",
    });
  });

  it("restores whatever body styles existed before the lock", async () => {
    setScrollY(10);

    document.body.style.overflow = "auto";
    document.body.style.position = "relative";
    document.body.style.top = "5px";
    document.body.style.width = "80%";

    const Wrapper = () => {
      useScrollLock(true);
      return <div />;
    };

    const { unmount } = render(<Wrapper />);

    await waitFor(() => {
      expect(document.body.style.overflow).toBe("hidden");
      expect(document.body.style.position).toBe("fixed");
      expect(document.body.style.top).toBe("-10px");
      expect(document.body.style.width).toBe("100%");
    });

    unmount();

    await waitFor(() => {
      expect(document.body.style.overflow).toBe("auto");
      expect(document.body.style.position).toBe("relative");
      expect(document.body.style.top).toBe("5px");
      expect(document.body.style.width).toBe("80%");
    });

    expect(window.scrollTo).toHaveBeenCalledTimes(1);
  });

  it("supports nested locks: does not unlock until the last lock unmounts", async () => {
    setScrollY(77);

    const Lock = ({ enable = true }: { enable?: boolean }) => {
      useScrollLock(enable);
      return <div />;
    };

    const App = ({ showA, showB }: { showA: boolean; showB: boolean }) => (
      <div>
        {showA ? <Lock /> : null}
        {showB ? <Lock /> : null}
      </div>
    );

    const { rerender } = render(<App showA={true} showB={true} />);

    await waitFor(() => {
      expect(document.body.style.overflow).toBe("hidden");
      expect(document.body.style.top).toBe("-77px");
    });

    rerender(<App showA={false} showB={true} />);

    await waitFor(() => {
      expect(document.body.style.overflow).toBe("hidden");
      expect(document.body.style.position).toBe("fixed");
    });

    expect(window.scrollTo).toHaveBeenCalledTimes(0);

    rerender(<App showA={false} showB={false} />);

    await waitFor(() => {
      expect(document.body.style.overflow).toBe("");
      expect(document.body.style.position).toBe("");
      expect(document.body.style.top).toBe("");
      expect(document.body.style.width).toBe("");
    });

    expect(window.scrollTo).toHaveBeenCalledTimes(1);
    expect(window.scrollTo).toHaveBeenCalledWith({
      top: 77,
      left: 0,
      behavior: "instant",
    });
  });

  it("restores computed paddingRight after lock/unlock", async () => {
    setScrollY(42);
    document.body.style.paddingRight = "";

    const originalGetComputedStyle = window.getComputedStyle;
    jest.spyOn(window, "getComputedStyle").mockImplementation((el: Element) => {
      const computed = originalGetComputedStyle(el);

      if (el === document.body) {
        return {
          ...computed,
          paddingRight: "12px",
          overflow: computed.overflow || "",
          position: computed.position || "",
          top: computed.top || "",
          width: computed.width || "",
        } as CSSStyleDeclaration;
      }

      return computed;
    });

    const Wrapper = ({ enable }: { enable: boolean }) => {
      useScrollLock(enable);
      return <div />;
    };

    const { rerender } = render(<Wrapper enable={true} />);

    await waitFor(() => {
      expect(document.body.style.overflow).toBe("hidden");
      expect(document.body.style.position).toBe("fixed");
      expect(document.body.style.top).toBe("-42px");
      expect(document.body.style.width).toBe("100%");
    });

    rerender(<Wrapper enable={false} />);

    await waitFor(() => {
      expect(document.body.style.overflow).toBe("");
      expect(document.body.style.position).toBe("");
      expect(document.body.style.top).toBe("");
      expect(document.body.style.width).toBe("");
      expect(document.body.style.paddingRight).toBe("");
    });
  });
});
