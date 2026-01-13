import type * as React from "react";

/** Accepts both mutable and readonly arrays */
export type ReadonlyableArray<T> = readonly T[] | T[];

/** React children, single or many */
export type Children = React.ReactNode | ReadonlyableArray<React.ReactNode>;

/** Content type used for UI styling */
export type ContentType = "error" | "info" | "static" | "success" | "warning";

/** Inline CSS style */
export type Style = React.CSSProperties;

/** Size presets for full/fitted layouts */
export type SizeDimension = "fit" | "full" | "max" | "min";

/** Standard size tokens used for various `vfx` properties */
export type SizeToken = "xxs" | "xs" | "s" | "m" | "l" | "xl" | "xxl";

type SpacingSize = "none" | SizeToken;
type AutoSize = "auto" | SpacingSize;
type Color = "default" | "inherit" | "muted" | "transparent";
type Overflow = "auto" | "hidden";

/**
 * Custom styling props that map to class names.
 * This is meant for consistent, token-based styling instead of inline CSS.
 * Keys are converted to class names and applied to the element.
 *
 * @example <ui.span vfx={{ axis: "y", gap: "m", padding: "m" }} />
 * @example <Box vfx={{ radius: "rounded", shadow: "subtle", border: true }} />
 */
export type Vfx = {
  /** Alignment orthogonal to the selected axis (Equivalent to align-items) */
  align?: "center" | "end" | "start";
  /** Direction the content spans; along the x-axis or y-axis (Equivalent to flex-direction) */
  axis?: "x" | "y" | "-x" | "-y";
  /** Background color */
  backgroundColor?: Color;
  /** Border for all edges */
  border?: boolean;
  /** Border bottom */
  borderBottom?: boolean;
  /** Border thickness */
  borderWidth?: "none" | "xs" | "s" | "m" | "l";
  /** Border type */
  borderStyle?: "dashed" | "dotted" | "none" | "solid";
  /** Border color */
  borderColor?: "default" | "primary";
  /** Border left */
  borderLeft?: boolean;
  /** Border right */
  borderRight?: boolean;
  /** Border top */
  borderTop?: boolean;
  /** Color */
  color?: Color;
  /** Supported cursor values */
  cursor?: "auto" | "pointer";
  /** Font size */
  fontSize?: "default" | SizeToken;
  /** Font weight */
  fontWeight?: 1 | 2 | 3 | 4 | 5 | 6 | 7 | 8 | 9;
  /** Spacing between children of the content */
  gap?: SpacingSize;
  /** Height of the content */
  height?: SizeDimension;
  /** Styles to apply on hover when element is not disabled */
  hover?: "dim" | "undim" | "shade";
  /** Text alignment */
  textAlign?: "center" | "left" | "right";
  /** Use italics */
  italics?: boolean;
  /** How to space the children (Equivalent to justify-content) */
  justify?: "around" | "between" | "center" | "end" | "start";
  /** Options for line height size */
  lineHeight?: "s" | "m" | "l";
  /** Margin outside the content */
  margin?: AutoSize;
  /** Bottom margin outside the content */
  marginBottom?: AutoSize;
  /** Left margin outside the content */
  marginLeft?: AutoSize;
  /** Right margin outside the content */
  marginRight?: AutoSize;
  /** Top margin outside the content */
  marginTop?: AutoSize;
  /** Horizontal margin outside the content */
  marginX?: AutoSize;
  /** Vertical margin outside the content */
  marginY?: AutoSize;
  /** Maximum height of the content */
  maxHeight?: SizeDimension;
  /** Maximum width of the content */
  maxWidth?: SizeDimension;
  /** Minimum height of the content */
  minHeight?: SizeDimension;
  /** Minimum width of the content */
  minWidth?: SizeDimension;
  /** Opacity presets */
  opacity?: "dim" | "disabled" | "full" | "none";
  /** How to handle overflow in the container */
  overflow?: Overflow;
  /** How to handle overflow in the X direction */
  overflowX?: Overflow;
  /** How to handle overflow in the Y direction */
  overflowY?: Overflow;
  /** Padding inside the content */
  padding?: SpacingSize;
  /** Bottom padding inside the content */
  paddingBottom?: SpacingSize;
  /** Left padding inside the content */
  paddingLeft?: SpacingSize;
  /** Right padding inside the content */
  paddingRight?: SpacingSize;
  /** Top padding inside the content */
  paddingTop?: SpacingSize;
  /** Horizontal padding inside the content */
  paddingX?: SpacingSize;
  /** Vertical padding inside the content */
  paddingY?: SpacingSize;
  /** Element's positioning */
  pos?: "absolute" | "fixed" | "relative" | "sticky";
  /** Border radius of the content */
  radius?: "max" | "none" | "rounded" | "subtle";
  /** Box shadow presets */
  shadow?: "floating" | "none" | "subtle";
  /** Flex presets to determine how a node stretches within its container */
  stretch?: "even" | "grow" | "max" | "min";
  /** Width of the content */
  width?: SizeDimension;
  /** Whether to allow wrapping of children */
  wrap?: boolean;
  /** Z-index to position the element at */
  z?: "auto" | "floating" | "max" | "nav";
};
