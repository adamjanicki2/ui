import { Vfx } from "./types";
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

type Transformer = (vfx: Vfx) => string | null;

const mapLayout: Transformer = ({
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
}) => {
  let className: string | null = pos ? `aui-pos-${pos}` : null;
  if (axis) className = classNames(className, `aui-flex-${axis}`);
  if (wrap) className = classNames(className, "aui-flex-wrap");
  if (align) className = classNames(className, `aui-align-${align}`);
  if (justify) className = classNames(className, `aui-justify-${justify}`);
  if (gap) className = classNames(className, `aui-gap-${gap}`);
  if (overflow) className = classNames(className, `aui-ov-${overflow}`);
  if (overflowX) className = classNames(className, `aui-ov-x-${overflowX}`);
  if (overflowY) className = classNames(className, `aui-ov-y-${overflowY}`);
  if (z) className = classNames(className, `aui-z-${z}`);

  return className;
};

const mapSpacing: Transformer = ({
  padding,
  paddingX,
  paddingY,
  paddingBottom,
  paddingTop,
  paddingLeft,
  paddingRight,
  margin,
  marginX,
  marginY,
  marginTop,
  marginBottom,
  marginLeft,
  marginRight,
}) => {
  // Use your existing spacingPrefixMap logic
  let className: string | null = null;
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
};

const dimensionProps = ["width", "height", "maxWidth", "maxHeight"] as const;

const mapDimensions: Transformer = (vfx) => {
  let className: string | null = null;
  dimensionProps.forEach((prop) => {
    const value = vfx[prop];
    if (value)
      className = classNames(
        className,
        `aui-${dimensionPrefixMap[prop]}-${value}`
      );
  });
  return className;
};

const mapBorders: Transformer = ({
  border,
  borderTop,
  borderBottom,
  borderLeft,
  borderRight,
  borderWidth,
  borderStyle,
  borderColor,
}) => {
  let className: string | null = null;

  const sides = {
    ba: border,
    bt: borderTop,
    bb: borderBottom,
    bl: borderLeft,
    br: borderRight,
  } as const;

  Object.entries(sides).forEach(([prefix, value]) => {
    if (value) {
      className = classNames(className, `aui-${prefix}`);
    }
  });

  const modifiers = {
    bw: borderWidth,
    bs: borderStyle,
    bc: borderColor,
  } as const;

  Object.entries(modifiers).forEach(([prefix, value]) => {
    if (value) {
      className = classNames(className, `aui-${prefix}-${value}`);
    }
  });

  return className;
};

const mapMiscellaneous: Transformer = ({
  radius,
  shadow,
  color,
  backgroundColor,
  opacity,
}) => {
  let className = radius ? `aui-radius-${radius}` : null;
  if (shadow) className = classNames(className, `aui-shadow-${shadow}`);
  if (color) className = classNames(className, `aui-c-${color}`);
  if (backgroundColor)
    className = classNames(className, `aui-bg-${backgroundColor}`);
  if (opacity) className = classNames(className, `aui-op-${opacity}`);

  return className;
};

const mapTypography: Transformer = ({
  fontSize,
  fontWeight,
  textAlign,
  italics,
}) => {
  let className: string | null = null;

  if (fontSize) className = classNames(className, `aui-f-${fontSize}`);
  if (fontWeight) className = classNames(className, `aui-fw-${fontWeight}`);
  if (textAlign) className = classNames(className, `aui-ta-${textAlign}`);
  if (italics) className = classNames(className, `aui-it`);

  return className;
};

const transformers = [
  mapLayout,
  mapSpacing,
  mapDimensions,
  mapBorders,
  mapTypography,
  mapMiscellaneous,
] as const;

export default function transformVfx(vfx: Vfx | undefined): string | null {
  if (!vfx) return null;
  const combinedClasses = classNames(
    ...transformers.map((transformer) => transformer(vfx))
  );
  return combinedClasses || null;
}
