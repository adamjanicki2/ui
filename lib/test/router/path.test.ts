import { matchPath } from "../../src/router/path";

describe("path", () => {
  describe("matchPath", () => {
    it("returns false for static patterns", () => {
      expect(matchPath("/", "/")).toEqual({});
      expect(matchPath("/about", "/about")).toEqual({});
    });

    it("normalizes slashes", () => {
      expect(matchPath("/movie/:id", "/movie/1/")).toEqual({ id: "1" });
      expect(matchPath("/movie/:id/", "/movie/1")).toEqual({ id: "1" });
      expect(matchPath("movie/:id", "movie/1/")).toEqual({ id: "1" });
      expect(matchPath(":id", "/1")).toEqual({ id: "1" });
    });

    it("returns false when chunks don't match", () => {
      expect(matchPath("/movie/:id", "/movie")).toBe(false);
      expect(matchPath("/movie/:id", "/movie/1/extra")).toBe(false);
      expect(matchPath("/", "/a")).toBe(false);
      expect(matchPath("/movie/:id", "/show/1")).toBe(false);
      expect(matchPath("/movie/:id/view", "/movie/1/edit")).toBe(false);
    });

    it("extracts params for :", () => {
      expect(matchPath("/movie/:id", "/movie/inception")).toEqual({
        id: "inception",
      });
      expect(
        matchPath("/movie/:slug/review/:id", "/movie/alien/review/1")
      ).toEqual({
        slug: "alien",
        id: "1",
      });
    });

    it("is defensive against empty param keys", () => {
      expect(matchPath("/movie/:", "/movie/1")).toBe(false);
      expect(matchPath("/movie/:   ", "/movie/1")).toBe(false);
    });
  });
});
