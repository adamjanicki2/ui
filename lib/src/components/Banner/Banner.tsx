import React from "react";
import type { ContentType } from "../../utils/types";
import classNames from "../../functions/classNames";
import Box, { type BoxProps } from "../Box/Box";

type Props = BoxProps & {
  /**
   * The type of badge to display.
   */
  type: ContentType;
};

const Banner = React.forwardRef<HTMLDivElement, Props>(
  ({ type, className, ...rest }, ref) => (
    <Box
      {...rest}
      className={classNames(`aui-content--${type} aui-banner`, className)}
      ref={ref}
    />
  )
);

export default Banner;
