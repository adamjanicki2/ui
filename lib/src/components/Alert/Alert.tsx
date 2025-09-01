import React from "react";
import type { ContentType } from "../../utils/types";
import classNames from "../../functions/classNames";
import Box, { type BoxProps } from "../Box/Box";

type Props = BoxProps & {
  /**
   * The type of alert to display.
   */
  type: ContentType;
};

const Alert = React.forwardRef<HTMLDivElement, Props>(
  ({ type, fx, className, ...rest }, ref) => (
    <Box
      {...rest}
      fx={{ radius: "rounded", ...fx }}
      className={classNames(`aui-alert aui-content-${type}`, className)}
      ref={ref}
    />
  )
);

export default Alert;
