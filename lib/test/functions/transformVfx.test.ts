import transformVfx from "../../src/utils/transformVfx";

describe("transformVfx", () => {
  it("returns null when vfx is undefined or empty", () => {
    expect(transformVfx(undefined)).toBeNull();
    expect(transformVfx({})).toBeNull();
  });

  it("transforms for simple case", () => {
    expect(
      transformVfx({ axis: "-x", align: "center", gap: "s", margin: "auto" })
    ).toBe("aui-flex--x aui-align-center aui-gap-s aui-ma-auto");
  });

  it("transforms and prioritizes more specific properties", () => {
    expect(
      transformVfx({
        paddingLeft: "xxl",
        paddingRight: "l",
        paddingTop: "m",
        paddingBottom: "s",
        paddingX: "xs",
        paddingY: "none",
        padding: "xl",
      })
    ).toBe("aui-pl-xxl aui-pr-l aui-pt-m aui-pb-s aui-pa-xl");
  });

  it("transforms and falls back to axis sizing when needed", () => {
    expect(
      transformVfx({
        marginLeft: "xxl",
        marginTop: "m",
        marginX: "xs",
        marginY: "none",
      })
    ).toBe("aui-ml-xxl aui-mt-m aui-mr-xs aui-mb-none");
  });

  it("handles flex options with wrap, justify, and align together", () => {
    expect(
      transformVfx({
        axis: "y",
        wrap: true,
        justify: "between",
        align: "end",
        gap: "l",
      })
    ).toBe(
      "aui-flex-y aui-flex-wrap aui-justify-between aui-align-end aui-gap-l"
    );
  });

  it("uses paddingX and paddingY when side-specific values are missing", () => {
    expect(
      transformVfx({
        paddingX: "s",
        paddingY: "m",
      })
    ).toBe("aui-pl-s aui-pr-s aui-pt-m aui-pb-m");
  });

  it("applies width/height/maxWidth/maxHeight correctly", () => {
    expect(
      transformVfx({
        width: "full",
        maxWidth: "fit",
        height: "min",
        maxHeight: "max",
      })
    ).toBe("aui-w-full aui-mw-fit aui-h-min aui-mh-max");
  });

  it("handles a full complex vfx", () => {
    expect(
      transformVfx({
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
      "aui-flex-x aui-flex-wrap aui-align-center aui-justify-around aui-gap-xs aui-pa-m aui-pb-s aui-pt-l aui-ma-none aui-ml-auto aui-mr-xxl aui-w-fit aui-h-max"
    );
  });

  it("handles layout props", () => {
    expect(
      transformVfx({
        pos: "fixed",
        axis: "x",
        gap: "m",
        align: "center",
        justify: "end",
        wrap: true,
        overflow: "hidden",
        overflowX: "scroll",
        overflowY: "hidden",
        z: "max",
      })
    ).toBe(
      "aui-pos-fixed aui-flex-x aui-gap-m aui-align-center aui-justify-end aui-flex-wrap aui-ov-hidden aui-ov-x-scroll aui-ov-y-hidden aui-z-max"
    );
  });

  it("handles spacing props with fallbacks", () => {
    expect(
      transformVfx({
        padding: "l",
        paddingX: "s",
        paddingY: "m",
        paddingTop: "xl",
        paddingBottom: "xs",
        margin: "auto",
        marginX: "l",
        marginY: "m",
        marginLeft: "xxl",
        marginRight: "none",
      })
    ).toBe(
      "aui-pa-l aui-pl-s aui-pr-s aui-pt-xl aui-pb-xs aui-ma-auto aui-mt-m aui-mb-m aui-ml-xxl aui-mr-none"
    );
  });

  it("handles dimensions correctly", () => {
    expect(
      transformVfx({
        width: "full",
        maxWidth: "fit",
        height: "min",
        maxHeight: "max",
      })
    ).toBe("aui-w-full aui-mw-fit aui-h-min aui-mh-max");
  });

  it("handles all border-related props", () => {
    expect(
      transformVfx({
        border: true,
        borderTop: true,
        borderBottom: true,
        borderLeft: true,
        borderRight: true,
        borderWidth: "m",
        borderStyle: "dotted",
        borderColor: "primary",
        radius: "rounded",
      })
    ).toBe(
      "aui-ba aui-bt aui-bb aui-bl aui-br aui-bw-m aui-bs-dotted aui-bc-primary aui-radius-rounded"
    );
  });

  it("handles typography props", () => {
    expect(
      transformVfx({
        fontSize: "xl",
        fontWeight: 5,
        textAlign: "center",
        italics: true,
      })
    ).toBe("aui-f-xl aui-fw-5 aui-ta-center aui-it");
  });

  it("handles effects and colors", () => {
    expect(
      transformVfx({
        shadow: "floating",
        opacity: "dim",
        color: "default",
        backgroundColor: "inherit",
      })
    ).toBe("aui-shadow-floating aui-op-dim aui-c-default aui-bg-inherit");
  });

  it("handles mixed complex vfx", () => {
    expect(
      transformVfx({
        pos: "absolute",
        axis: "-y",
        gap: "xs",
        align: "start",
        justify: "between",
        wrap: true,
        padding: "m",
        paddingX: "s",
        paddingY: "l",
        paddingTop: "xl",
        margin: "auto",
        marginBottom: "xxl",
        width: "fit",
        height: "max",
        border: true,
        borderStyle: "solid",
        fontWeight: 7,
        italics: true,
        shadow: "subtle",
        color: "default",
        backgroundColor: "default",
        cursor: "pointer",
      })
    ).toBe(
      "aui-pos-absolute aui-flex--y aui-gap-xs aui-align-start aui-justify-between aui-flex-wrap aui-pa-m aui-pl-s aui-pr-s aui-pb-l aui-pt-xl aui-ma-auto aui-mb-xxl aui-w-fit aui-h-max aui-ba aui-bs-solid aui-fw-7 aui-it aui-shadow-subtle aui-c-default aui-bg-default aui-cursor-pointer"
    );
  });
});
