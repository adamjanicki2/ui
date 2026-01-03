import type * as React from "react";

/** Accepts both mutable and readonly arrays */
export type ReadonlyableArray<T> = readonly T[] | T[];

/** React children, single or many */
export type Children = React.ReactNode | ReadonlyableArray<React.ReactNode>;

/** Content type used for UI styling */
export type ContentType = "success" | "warning" | "error" | "info" | "static";

/** Inline CSS style */
export type Style = React.CSSProperties;

/** Size presets for full/fitted layouts */
export type SizeDimension = "full" | "fit" | "min" | "max";

/** Standard size tokens used for various `vfx` properties */
export type SizeToken = "xxs" | "xs" | "s" | "m" | "l" | "xl" | "xxl";

type SpacingSize = SizeToken | "none";
type AutoSize = SpacingSize | "auto";
type Color = "default" | "muted" | "inherit" | "transparent";
type Overflow = "hidden" | "scroll";

/**
 * Custom styling props that map to class names
 *
 * This is meant for consistent, token-based styling instead of inline CSS
 *
 * @example <ui.div vfx={{ axis: "y", gap: "m", padding: "m" }} />
 * @example <Box vfx={{ radius: "rounded", shadow: "subtle", border: true }} />
 */
export type Vfx = {
  /** Element's positioning */
  pos?: "static" | "relative" | "absolute" | "fixed" | "sticky";
  /** Direction the content spans; along the x-axis or y-axis (Equivalent to flex-direction) */
  axis?: "x" | "y" | "-x" | "-y";
  /** Spacing between children of the content */
  gap?: SpacingSize;
  /** Alignment orthogonal to the selected axis (Equivalent to align-items) */
  align?: "start" | "center" | "end";
  /** How to space the children (Equivalent to justify-content) */
  justify?: "start" | "center" | "between" | "around" | "end";
  /** Flex presets to determine how a node stretches within its container */
  stretch?: "even" | "grow" | "min" | "max";
  /** Whether to allow wrapping of children */
  wrap?: boolean;
  /** How to handle overflow in the container */
  overflow?: Overflow;
  /** How to handle overflow in the X direction */
  overflowX?: Overflow;
  /** How to handle overflow in the Y direction */
  overflowY?: Overflow;
  /** Z-index to position the element at */
  z?: "auto" | "floating" | "nav" | "max";

  /** Padding inside the content */
  padding?: SpacingSize;
  /** Horizontal padding inside the content */
  paddingX?: SpacingSize;
  /** Vertical padding inside the content */
  paddingY?: SpacingSize;
  /** Top padding inside the content */
  paddingTop?: SpacingSize;
  /** Bottom padding inside the content */
  paddingBottom?: SpacingSize;
  /** Left padding inside the content */
  paddingLeft?: SpacingSize;
  /** Right padding inside the content */
  paddingRight?: SpacingSize;

  /** Margin outside the content */
  margin?: AutoSize;
  /** Horizontal margin outside the content */
  marginX?: AutoSize;
  /** Vertical margin outside the content */
  marginY?: AutoSize;
  /** Top margin outside the content */
  marginTop?: AutoSize;
  /** Bottom margin outside the content */
  marginBottom?: AutoSize;
  /** Left margin outside the content */
  marginLeft?: AutoSize;
  /** Right margin outside the content */
  marginRight?: AutoSize;

  /** Width of the content */
  width?: SizeDimension;
  /** Minimum width of the content */
  minWidth?: SizeDimension;
  /** Maximum width of the content */
  maxWidth?: SizeDimension;
  /** Height of the content */
  height?: SizeDimension;
  /** Minimum height of the content */
  minHeight?: SizeDimension;
  /** Maximum height of the content */
  maxHeight?: SizeDimension;

  /** Border radius of the content */
  radius?: "none" | "subtle" | "rounded" | "max";
  /** Border for all edges */
  border?: boolean;
  /** Border top */
  borderTop?: boolean;
  /** Border bottom */
  borderBottom?: boolean;
  /** Border left */
  borderLeft?: boolean;
  /** Border right */
  borderRight?: boolean;
  /** Border thickness */
  borderWidth?: SpacingSize;
  /** Border type */
  borderStyle?: "none" | "solid" | "dotted" | "dashed";
  /** Border color */
  borderColor?: "default" | "primary";

  /** Box shadow presets */
  shadow?: "subtle" | "floating" | "none";

  /** Opacity presets */
  opacity?: "none" | "disabled" | "dim" | "full";

  /** Font size */
  fontSize?: SizeToken | "default";
  /** Font weight */
  fontWeight?: 1 | 2 | 3 | 4 | 5 | 6 | 7 | 8 | 9;
  /** Text alignment */
  textAlign?: "center" | "left" | "right";
  /** Use italics */
  italics?: boolean;

  /** Color */
  color?: Color;
  /** Background color */
  backgroundColor?: Color;

  /** Supported cursor values */
  cursor?: "auto" | "pointer";
};
