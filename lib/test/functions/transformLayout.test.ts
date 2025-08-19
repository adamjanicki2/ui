import transformLayout from "../../src/utils/transformLayout";

describe("transformLayout", () => {
  it("returns null when layout is undefined or empty", () => {
    expect(transformLayout(undefined)).toBeNull();
    expect(transformLayout({})).toBeNull();
  });

  it("transforms for simple case", () => {
    expect(
      transformLayout({ axis: "x", align: "center", gap: "s", margin: "auto" })
    ).toBe("aui-flex-x aui-align-center aui-gap-s aui-ma-auto");
  });

  it("transforms and prioritizes more specific properties", () => {
    expect(
      transformLayout({
        paddingLeft: "xxl",
        paddingRight: "l",
        paddingTop: "m",
        paddingBottom: "s",
        paddingX: "xs",
        paddingY: "none",
        padding: "xl",
      })
    ).toBe("aui-pa-xl aui-pt-m aui-pb-s aui-pl-xxl aui-pr-l");
  });

  it("transforms and falls back to axis sizing when needed", () => {
    expect(
      transformLayout({
        marginLeft: "xxl",
        marginTop: "m",
        marginX: "xs",
        marginY: "none",
      })
    ).toBe("aui-mt-m aui-mb-none aui-ml-xxl aui-mr-xs");
  });
});
