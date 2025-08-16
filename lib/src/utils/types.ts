import React from "react";

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
 * Default props for a div element
 */
export type DivProps = React.DetailedHTMLProps<
  React.HTMLAttributes<HTMLDivElement>,
  HTMLDivElement
>;
/**
 * Size variants used for CSS.
 */
type SizeToken = "xxs" | "xs" | "s" | "m" | "l" | "xl" | "xxl";

/**
 * Size prop used to transform into a CSS class or style value if a number.
 */
type Size = SizeToken | number;

/**
 * Layout props for a box component.
 */
export type Layout = {
  /**
   * Direction the box spans; along the x-axis or y-axis
   * (Equivalent to flex-direction)
   */
  axis: "x" | "y";
  /**
   * Spacing between children of the box
   */
  gap?: Size;
  /**
   * Alignment orthogonal to the selected axis
   * (Equivalent to align-items)
   */
  align?: "start" | "center" | "end";
  /**
   * How to layout the children
   * (Equivalent to justify-content)
   */
  justify?: "start" | "center" | "between" | "end";
  /**
   * Padding on the inside of the box
   */
  padding?: Size;
  /**
   * Margin on the outside of the box
   */
  margin?: Size;
  /**
   * Whether to allow wrapping of box children
   */
  wrap?: boolean;
};
