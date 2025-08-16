import React from "react";
import type { ContentType, CornerType } from "../../utils/types";
import classNames from "../../functions/classNames";
import Box, { type BoxProps } from "../Box/Box";

type Props = BoxProps & {
  /**
   * The type of alert to display.
   */
  type: ContentType;
  /**
   * [Optional] The corner style of the alert.
   * @default "rounded"
   */
  corners?: CornerType;
};

const Alert = React.forwardRef<HTMLDivElement, Props>(
  ({ type, corners = "rounded", className, ...rest }, ref) => (
    <Box
      {...rest}
      className={classNames(
        `aui-alert aui-content--${type} aui-corners--${corners}`,
        className
      )}
      ref={ref}
    />
  )
);

export default Alert;
