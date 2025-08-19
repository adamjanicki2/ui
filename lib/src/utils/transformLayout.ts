import { Layout } from "./types";
import { classNames } from "../functions";

// Prefix maps for padding and margin keys
const spacingPrefixMap = {
  padding: "pa",
  paddingTop: "pt",
  paddingBottom: "pb",
  paddingLeft: "pl",
  paddingRight: "pr",
  margin: "ma",
  marginTop: "mt",
  marginBottom: "mb",
  marginLeft: "ml",
  marginRight: "mr",
} as const;

export default function transformLayout(
  layout: Layout | undefined
): string | null {
  if (!layout) return null;

  const {
    axis,
    gap,
    align,
    justify,
    wrap,

    padding,
    paddingTop,
    paddingBottom,
    paddingLeft,
    paddingRight,
    paddingX,
    paddingY,

    margin,
    marginTop,
    marginBottom,
    marginLeft,
    marginRight,
    marginX,
    marginY,
  } = layout;

  let className = axis ? `aui-flex-${axis}` : null;

  if (wrap) className = classNames(className, "aui-flex-wrap");
  if (align) className = classNames(className, `aui-align-${align}`);
  if (justify) className = classNames(className, `aui-justify-${justify}`);

  // Gap
  if (gap) {
    className = classNames(className, `aui-gap-${gap}`);
  }

  // Padding & margin
  const spacingProps = [
    ["padding", padding],
    ["paddingTop", paddingTop ?? paddingY],
    ["paddingBottom", paddingBottom ?? paddingY],
    ["paddingLeft", paddingLeft ?? paddingX],
    ["paddingRight", paddingRight ?? paddingX],
    ["margin", margin],
    ["marginTop", marginTop ?? marginY],
    ["marginBottom", marginBottom ?? marginY],
    ["marginLeft", marginLeft ?? marginX],
    ["marginRight", marginRight ?? marginX],
  ] as const;

  spacingProps.forEach(([prop, value]) => {
    if (value) {
      const prefix = spacingPrefixMap[prop];
      className = classNames(className, `aui-${prefix}-${value}`);
    }
  });

  return className;
}
