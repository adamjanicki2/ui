import React from "react";
import type { ContentType, DivProps } from "../../utils/types";
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
      className={classNames(`aui-content--${type} aui-banner`, className)}
      ref={ref}
    />
  )
);

export default Banner;
