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

  it("handles flex options with wrap, justify, and align together", () => {
    expect(
      transformLayout({
        axis: "y",
        wrap: true,
        justify: "between",
        align: "end",
        gap: "l",
      })
    ).toBe(
      "aui-flex-y aui-flex-wrap aui-align-end aui-justify-between aui-gap-l"
    );
  });

  it("uses paddingX and paddingY when side-specific values are missing", () => {
    expect(
      transformLayout({
        paddingX: "s",
        paddingY: "m",
      })
    ).toBe("aui-pt-m aui-pb-m aui-pl-s aui-pr-s");
  });

  it("applies width/height/maxWidth/maxHeight correctly", () => {
    expect(
      transformLayout({
        width: "full",
        maxWidth: "fit",
        height: "min",
        maxHeight: "max",
      })
    ).toBe("aui-w-full aui-h-min aui-mw-fit aui-mh-max");
  });

  it("handles a full complex layout", () => {
    expect(
      transformLayout({
        axis: "x",
        wrap: true,
        align: "center",
        justify: "around",
        gap: "xs",
        padding: "m",
        paddingY: "s",
        paddingTop: "l",
        margin: "none",
        marginX: "auto",
        marginRight: "xxl",
        width: "fit",
        height: "max",
      })
    ).toBe(
      "aui-flex-x aui-flex-wrap aui-align-center aui-justify-around aui-gap-xs aui-pa-m aui-pt-l aui-pb-s aui-ma-none aui-ml-auto aui-mr-xxl aui-w-fit aui-h-max"
    );
  });
});
