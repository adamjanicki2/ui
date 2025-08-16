import React from "react";
import type { Style, Layout } from "../../utils/types";
import { classNames } from "../../functions";

type Props = React.DetailedHTMLProps<
  React.HTMLAttributes<HTMLDivElement>,
  HTMLDivElement
> & {
  /**
   * The organization of the container and its children.
   */
  layout?: Layout;
};

const Box = React.forwardRef<HTMLDivElement, Props>(
  ({ layout, className, style, ...rest }, ref) => {
    const transformedLayout = transformLayout(layout);

    return (
      <div
        {...rest}
        className={classNames(transformedLayout.className, className)}
        style={{ ...transformedLayout.style, ...style }}
        ref={ref}
      />
    );
  }
);

type CSS = {
  className?: string;
  style?: Style;
};

function transformLayout(layout: Layout | undefined): CSS {
  if (!layout) return { className: undefined, style: undefined };
  const { axis, gap, align, justify, padding, margin, wrap } = layout;

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
