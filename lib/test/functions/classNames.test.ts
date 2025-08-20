import { classNames } from "../../src";

describe("classNames", () => {
  it("concats classNames", () => {
    expect(classNames("a", "b", "c")).toBe("a b c");
  });

  it("discards null, undefined, and empty string", () => {
    expect(classNames(null, "a", "", "b", undefined, "c")).toBe("a b c");
  });

  it("ignores extraneous spaces", () => {
    expect(classNames(" more ", "spaces ", " here")).toBe("more spaces here");
  });
});
