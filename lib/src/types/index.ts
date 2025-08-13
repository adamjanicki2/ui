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
