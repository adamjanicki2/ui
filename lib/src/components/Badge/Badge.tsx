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

const Badge = React.forwardRef<HTMLDivElement, Props>(
  ({ type, className, fx, ...rest }, ref) => (
    <Box
      {...rest}
      fx={{ radius: "rounded", ...fx }}
      className={classNames(`aui-badge aui-content--${type}`, className)}
      ref={ref}
    />
  )
);

export default Badge;
