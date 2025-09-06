import { getDeviceType } from "../../src";

describe("getDeviceType", () => {
  it("returns desktop", () => {
    expect(getDeviceType()).toBe("desktop");
  });
});
