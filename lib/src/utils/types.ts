import React from "react";

/**
 * Default children type; can be a node or list of nodes
 */
export type Children = React.ReactNode | React.ReactNode[];
/**
 * The type of corner to display, controlling the border radius property.
 */
export type CornerType = "pill" | "rounded" | "sharp";
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
type SizeToken = "none" | "xxs" | "xs" | "s" | "m" | "l" | "xl" | "xxl";
/**
 * Used for margin
 */
type AutoSize = SizeToken | "auto";

/** Layout props for a component */
export type Layout = {
  // General layout

  /** Direction the layout spans; along the x-axis or y-axis (Equivalent to flex-direction) */
  axis?: "x" | "y" | "-x" | "-y";
  /** Spacing between children of the layout */
  gap?: SizeToken;
  /** Alignment orthogonal to the selected axis (Equivalent to align-items) */
  align?: "start" | "center" | "end";
  /** How to layout the children (Equivalent to justify-content) */
  justify?: "start" | "center" | "between" | "around" | "end";
  /** Whether to allow wrapping of layout children */
  wrap?: boolean;

  // Spacing

  /** Padding inside the layout */
  padding?: SizeToken;
  /** Horizontal padding inside the layout */
  paddingX?: SizeToken;
  /** Vertical padding inside the layout */
  paddingY?: SizeToken;
  /** Top padding inside the layout */
  paddingTop?: SizeToken;
  /** Bottom padding inside the layout */
  paddingBottom?: SizeToken;
  /** Left padding inside the layout */
  paddingLeft?: SizeToken;
  /** Right padding inside the layout */
  paddingRight?: SizeToken;

  /** Margin outside the layout */
  margin?: AutoSize;
  /** Horizontal margin outside the layout */
  marginX?: AutoSize;
  /** Vertical margin outside the layout */
  marginY?: AutoSize;
  /** Top margin outside the layout */
  marginTop?: AutoSize;
  /** Bottom margin outside the layout */
  marginBottom?: AutoSize;
  /** Left margin outside the layout */
  marginLeft?: AutoSize;
  /** Right margin outside the layout */
  marginRight?: AutoSize;

  // Width & Height

  /** Width of the layout */
  width?: SizeDimension;
  /** Maximum width of the layout */
  maxWidth?: SizeDimension;
  /** Height of the laout */
  height?: SizeDimension;
  /** Maximum of the layout */
  maxHeight?: SizeDimension;
};
