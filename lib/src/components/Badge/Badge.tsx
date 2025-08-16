import React from "react";
import type { ContentType, CornerType } from "../../utils/types";
import classNames from "../../functions/classNames";
import Box, { type BoxProps } from "../Box/Box";

type Props = BoxProps & {
  /**
   * The type of badge to display.
   */
  type: ContentType;
  /**
   * [Optional] The corner style of the badge.
   * @default "rounded"
   */
  corners?: CornerType;
};

const Badge = React.forwardRef<HTMLDivElement, Props>(
  ({ type, className, corners = "rounded", ...rest }, ref) => (
    <Box
      {...rest}
      className={classNames(
        `aui-badge aui-content--${type} aui-corners--${corners}`,
        className
      )}
      ref={ref}
    />
  )
);

export default Badge;
