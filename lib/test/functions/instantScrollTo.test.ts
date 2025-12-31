import { instantScrollTo } from "../../src";

describe("instantScrollTo", () => {
  const html = document.documentElement;

  beforeEach(() => {
    (
      window.scrollTo as jest.MockedFunction<typeof window.scrollTo>
    ).mockClear();
    html.removeAttribute("style");
    document.body.removeAttribute("style");
  });

  it("scrolls and restores style", () => {
    instantScrollTo({ top: 0, left: 0 });

    expect(window.scrollTo).toHaveBeenCalledTimes(1);
    expect(window.scrollTo).toHaveBeenCalledWith(0, 0);
    expect(html.hasAttribute("style")).toBe(false);
    expect(document.body.hasAttribute("style")).toBe(false);
  });

  it("temporarily disables scroll behavior", () => {
    html.setAttribute("style", "scroll-behavior: smooth; color: red;");
    document.body.setAttribute(
      "style",
      "scroll-behavior: smooth; background: blue;"
    );

    (
      window.scrollTo as jest.MockedFunction<typeof window.scrollTo>
    ).mockImplementationOnce(() => {
      expect(html.style.scrollBehavior).toBe("auto");
      expect(document.body.style.scrollBehavior).toBe("auto");
    });

    instantScrollTo({ left: 100, top: 200 });

    expect(html.style.scrollBehavior).toBe("smooth");
    expect(html.style.color).toBe("red");
    expect(document.body.style.scrollBehavior).toBe("smooth");
    expect(document.body.style.background).toBe("blue");
  });

  it("preserves existing inline styles even if scrollBehavior was not set", () => {
    html.setAttribute("style", "color: red;");
    document.body.setAttribute("style", "background: blue;");

    instantScrollTo({ left: 0, top: 0 });

    expect(html.style.color).toBe("red");
    expect(html.style.scrollBehavior).toBe("");
    expect(document.body.style.background).toBe("blue");
    expect(document.body.style.scrollBehavior).toBe("");
  });
});
