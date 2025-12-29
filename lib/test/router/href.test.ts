import { getHref, isExternal } from "../../src/router/href";

describe("href", () => {
  describe("getHref", () => {
    it("returns absolute tos", () => {
      expect(getHref("/a/b/c", "/base/slug", "")).toEqual({
        type: "internal",
        url: "/a/b/c",
      });

      expect(getHref("/a", "/base/slug/", "")).toEqual({
        type: "internal",
        url: "/a",
      });

      expect(getHref("/a/", "/base/slug/", "/app")).toEqual({
        type: "internal",
        url: "/app/a/",
      });

      expect(getHref("/a/b", "/base/slug", "/app")).toEqual({
        type: "internal",
        url: "/app/a/b",
      });

      expect(getHref("/a", "/", "/app")).toEqual({
        type: "internal",
        url: "/app/a",
      });

      expect(getHref("/a/b/", "/base", "app")).toEqual({
        type: "internal",
        url: "/app/a/b/",
      });

      expect(getHref("/a/b/c", "/base", "/app/")).toEqual({
        type: "internal",
        url: "/app/a/b/c",
      });

      expect(getHref("/", "/base", "/app")).toEqual({
        type: "internal",
        url: "/app/",
      });

      expect(getHref("/app", "/app/other", "/app")).toEqual({
        type: "internal",
        url: "/app/app",
      });
    });

    it("returns relative tos with current pathname", () => {
      expect(getHref("rel", "/", "")).toEqual({
        type: "internal",
        url: "/rel",
      });

      expect(getHref("rel", "/base", "")).toEqual({
        type: "internal",
        url: "/base/rel",
      });

      expect(getHref("rel", "/base/", "")).toEqual({
        type: "internal",
        url: "/base/rel",
      });

      expect(getHref("relative", "/app/base", "/app")).toEqual({
        type: "internal",
        url: "/app/base/relative",
      });

      expect(getHref("relative", "/app/base/", "/app")).toEqual({
        type: "internal",
        url: "/app/base/relative",
      });

      expect(getHref("", "/app/current/", "/app")).toEqual({
        type: "internal",
        url: "/app/current/",
      });

      expect(getHref("", "/app/current", "/app")).toEqual({
        type: "internal",
        url: "/app/current",
      });

      expect(getHref("rel", "base", "")).toEqual({
        type: "internal",
        url: "/base/rel",
      });

      expect(getHref("rel", "app/base", "/app")).toEqual({
        type: "internal",
        url: "/app/base/rel",
      });

      expect(getHref("rel", "/app", "/app")).toEqual({
        type: "internal",
        url: "/app/rel",
      });

      expect(getHref("rel", "/app/", "/app")).toEqual({
        type: "internal",
        url: "/app/rel",
      });

      expect(getHref("rel", "/app/base", "app")).toEqual({
        type: "internal",
        url: "/app/base/rel",
      });

      expect(getHref("rel", "/app/base", "/app/")).toEqual({
        type: "internal",
        url: "/app/base/rel",
      });

      expect(getHref("rel", "/base", "/app")).toEqual({
        type: "internal",
        url: "/app/base/rel",
      });

      expect(getHref("rel", "/base/", "/app")).toEqual({
        type: "internal",
        url: "/app/base/rel",
      });

      expect(getHref("rel", "/", "/app")).toEqual({
        type: "internal",
        url: "/app/rel",
      });
    });
  });

  describe("isExternal", () => {
    it("returns true for external URLs", () => {
      expect(isExternal("https://example.com")).toBe(true);
      expect(isExternal("http://example.com")).toBe(true);
      expect(isExternal("mailto:test@example.com")).toBe(true);
      expect(isExternal("tel:+123456789")).toBe(true);
    });

    it("returns false for internal and relative paths", () => {
      expect(isExternal("/about")).toBe(false);
      expect(isExternal("example.com")).toBe(false);
      expect(isExternal("home/landing")).toBe(false);
    });
  });
});
