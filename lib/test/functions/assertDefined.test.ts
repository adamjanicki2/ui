import { assertDefined } from "../../src";

describe("assertDefined", () => {
  test("assertDefined throws for undefined", () => {
    expect(() => assertDefined(undefined)).toThrow();
  });

  test("assertDefined doesn't throw for everything else", () => {
    expect(assertDefined("")).toBe("");
    expect(assertDefined(null)).toBe(null);
    expect(assertDefined(0)).toBe(0);
    expect(assertDefined([])).toEqual([]);
    expect(assertDefined({})).toEqual({});
  });
});
