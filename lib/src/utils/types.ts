import React from "react";

/**
 * Default children type; can be a node or list of nodes
 */
export type Children = React.ReactNode | React.ReactNode[];
/**
 * The type of message associated with a piece of content.
 */
export type ContentType = "success" | "warning" | "error" | "info" | "static";
/**
 * Standard style object to apply inline styling to components.
 */
export type Style = React.CSSProperties;
/**
 * Used for width and height
 */
export type SizeDimension = "full" | "fit" | "min" | "max";
/**
 * Size variants used for CSS.
 */
export type SizeToken = "xxs" | "xs" | "s" | "m" | "l" | "xl" | "xxl";
/**
 * Size variants used for padding & margin
 */
type SpacingSize = SizeToken | "none";
/**
 * Used for margin
 */
type AutoSize = SpacingSize | "auto";

/** visual styling props for an element. Gets transformed into a set of class names. */
export type Fx = {
  /** Direction the content spans; along the x-axis or y-axis (Equivalent to flex-direction) */
  axis?: "x" | "y" | "-x" | "-y";
  /** Spacing between children of the content */
  gap?: SpacingSize;
  /** Alignment orthogonal to the selected axis (Equivalent to align-items) */
  align?: "start" | "center" | "end";
  /** How to content the children (Equivalent to justify-content) */
  justify?: "start" | "center" | "between" | "around" | "end";
  /** Whether to allow wrapping of children */
  wrap?: boolean;

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
  /** Maximum width of the content */
  maxWidth?: SizeDimension;
  /** Height of the content */
  height?: SizeDimension;
  /** Maximum of the content */
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
  shadow?: "subtle" | "floating" | "sharp";

  /** Opacity presets */
  opacity?: "none" | "disabled" | "dim" | "full";

  /** Font size */
  fontSize?: SizeToken;
  /** Font weight */
  fontWeight?: 1 | 2 | 3 | 4 | 5 | 6 | 7 | 8 | 9;
  /** Text alignment */
  textAlign?: "center" | "left" | "right";
  /** Use italics? */
  italics?: boolean;
};
