import React from "react";
import type { DivProps, Size, Style } from "../../utils/types";
import { classNames } from "../../functions";

type BoxProps = {
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

type Props = DivProps & BoxProps;

const Box = React.forwardRef<HTMLDivElement, Props>(
  (
    {
      axis,
      gap,
      align,
      justify,
      padding,
      margin,
      wrap,
      className,
      style,
      ...rest
    },
    ref
  ) => {
    const transformedProps = transformProps({
      axis,
      gap,
      align,
      justify,
      padding,
      margin,
      wrap,
    });

    return (
      <div
        {...rest}
        className={classNames(transformedProps.className, className)}
        style={{ ...transformedProps.style, ...style }}
        ref={ref}
      />
    );
  }
);

function transformProps(props: BoxProps) {
  const { axis, gap, align, justify, padding, margin, wrap } = props;

  const style: Style = {};
  let className = `aui-flex-${axis}`;

  if (align) {
    className = classNames(className, `aui-align-${align}`);
  }

  if (justify) {
    className = classNames(className, `aui-justify-${justify}`);
  }

  if (wrap) {
    className = classNames(className, "aui-flex-wrap");
  }

  if (gap) {
    if (typeof gap === "number") style.gap = gap;
    else className = classNames(className, `aui-gap-${gap}`);
  }

  if (padding) {
    if (typeof padding === "number") style.padding = padding;
    else className = classNames(className, `aui-pa-${padding}`);
  }

  if (margin) {
    if (typeof margin === "number") style.margin = margin;
    else className = classNames(className, `aui-ma-${margin}`);
  }

  return { className, style };
}

export type { Props as BoxProps };
export default Box;
