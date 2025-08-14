import React from "react";
import type { ContentType, DivProps } from "../../types";
import classNames from "../../functions/classNames";

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
      className={classNames(`ajui-content--${type} ajui-banner`, className)}
      ref={ref}
    />
  )
);

export default Banner;
