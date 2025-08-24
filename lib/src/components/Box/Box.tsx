import React from "react";
import type { Layout, Children } from "../../utils/types";
import { classNames } from "../../functions";
import transformLayout from "../../utils/transformLayout";

type Props = Omit<
  React.DetailedHTMLProps<React.HTMLAttributes<HTMLDivElement>, HTMLDivElement>,
  "children"
> & {
  /**
   * Children to render inside the box
   */
  children?: Children;
  /**
   * The organization of the container and its children.
   */
  layout?: Layout;
};

const Box = React.forwardRef<HTMLDivElement, Props>(
  ({ layout, className, ...rest }, ref) => (
    <div
      {...rest}
      className={classNames("aui-box", transformLayout(layout), className)}
      ref={ref}
    />
  )
);

export type { Props as BoxProps };
export default Box;
