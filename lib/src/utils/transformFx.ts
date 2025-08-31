import { Fx } from "./types";
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

const dimensionPrefixMap = {
  width: "w",
  maxWidth: "mw",
  height: "h",
  maxHeight: "mh",
} as const;

export default function transformFx(fx: Fx | undefined): string | null {
  if (!fx) return null;

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

    ...rest
  } = fx;

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

  const dimensionProps = ["width", "height", "maxWidth", "maxHeight"] as const;
  dimensionProps.forEach((prop) => {
    const value = rest[prop];
    if (value) {
      const prefix = dimensionPrefixMap[prop];
      className = classNames(className, `aui-${prefix}-${value}`);
    }
  });

  return className;
}
