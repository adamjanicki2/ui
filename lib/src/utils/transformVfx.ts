import { Vfx } from "./types";

export default function transformVfx(vfx: Vfx | undefined): string | null {
  if (!vfx) return null;

  const {
    pos,
    axis,
    wrap,
    align,
    justify,
    gap,
    overflow,
    overflowX,
    overflowY,
    z,

    padding,
    paddingX,
    paddingY,
    paddingTop,
    paddingBottom,
    paddingLeft,
    paddingRight,

    margin,
    marginX,
    marginY,
    marginTop,
    marginBottom,
    marginLeft,
    marginRight,

    width,
    height,
    maxWidth,
    maxHeight,

    border,
    borderTop,
    borderBottom,
    borderRight,
    borderLeft,
    borderColor,
    borderStyle,
    borderWidth,

    fontSize,
    fontWeight,
    textAlign,
    italics,

    radius,
    shadow,
    color,
    backgroundColor,
    opacity,
  } = vfx;

  const classes: string[] = [];

  // --- Layout ---
  if (pos) classes.push(`aui-pos-${pos}`);
  if (axis) classes.push(`aui-flex-${axis}`);
  if (wrap) classes.push("aui-flex-wrap");
  if (align) classes.push(`aui-align-${align}`);
  if (justify) classes.push(`aui-justify-${justify}`);
  if (gap) classes.push(`aui-gap-${gap}`);
  if (overflow) classes.push(`aui-ov-${overflow}`);
  if (overflowX) classes.push(`aui-ov-x-${overflowX}`);
  if (overflowY) classes.push(`aui-ov-y-${overflowY}`);
  if (z) classes.push(`aui-z-${z}`);

  // --- Spacing ---
  const pt = paddingTop ?? paddingY;
  const pb = paddingBottom ?? paddingY;
  const pl = paddingLeft ?? paddingX;
  const pr = paddingRight ?? paddingX;
  const mt = marginTop ?? marginY;
  const mb = marginBottom ?? marginY;
  const ml = marginLeft ?? marginX;
  const mr = marginRight ?? marginX;

  if (padding) classes.push(`aui-pa-${padding}`);
  if (pt) classes.push(`aui-pt-${pt}`);
  if (pb) classes.push(`aui-pb-${pb}`);
  if (pl) classes.push(`aui-pl-${pl}`);
  if (pr) classes.push(`aui-pr-${pr}`);
  if (margin) classes.push(`aui-ma-${margin}`);
  if (mt) classes.push(`aui-mt-${mt}`);
  if (mb) classes.push(`aui-mb-${mb}`);
  if (ml) classes.push(`aui-ml-${ml}`);
  if (mr) classes.push(`aui-mr-${mr}`);

  // --- Dimensions ---
  if (width) classes.push(`aui-w-${width}`);
  if (height) classes.push(`aui-h-${height}`);
  if (maxWidth) classes.push(`aui-mw-${maxWidth}`);
  if (maxHeight) classes.push(`aui-mh-${maxHeight}`);

  // --- Borders ---
  if (border) classes.push("aui-ba");
  if (borderTop) classes.push("aui-bt");
  if (borderBottom) classes.push("aui-bb");
  if (borderLeft) classes.push("aui-bl");
  if (borderRight) classes.push("aui-br");

  if (borderWidth) classes.push(`aui-bw-${borderWidth}`);
  if (borderStyle) classes.push(`aui-bs-${borderStyle}`);
  if (borderColor) classes.push(`aui-bc-${borderColor}`);

  // --- Typography ---
  if (fontSize) classes.push(`aui-f-${fontSize}`);
  if (fontWeight) classes.push(`aui-fw-${fontWeight}`);
  if (textAlign) classes.push(`aui-ta-${textAlign}`);
  if (italics) classes.push("aui-it");

  // --- Misc ---
  if (radius) classes.push(`aui-radius-${radius}`);
  if (shadow) classes.push(`aui-shadow-${shadow}`);
  if (color) classes.push(`aui-c-${color}`);
  if (backgroundColor) classes.push(`aui-bg-${backgroundColor}`);
  if (opacity) classes.push(`aui-op-${opacity}`);

  return classes.join(" ") || null;
}
