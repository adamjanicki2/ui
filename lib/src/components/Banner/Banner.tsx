import React from "react";
import { ContentType } from "../../types";
import classNames from "../../functions/classNames";
import type { DivProps } from "../../types";

type Props = DivProps & {
  /**
   * The type of badge to display.
   */
  type: ContentType;
};

const Banner = React.forwardRef<HTMLDivElement, Props>(
  ({ type, className, ...rest }, ref) => (
    <div
      {...rest}
      className={classNames(`content--${type} ajui-banner`, className)}
      ref={ref}
    />
  )
);

export default Banner;
