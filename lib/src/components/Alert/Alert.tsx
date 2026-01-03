import React from "react";
import type { ContentType } from "../../types/common";
import classNames from "../../functions/classNames";
import Box, { type BoxProps } from "../Box/Box";

type Props = BoxProps & {
  /**
   * The type of alert to display.
   */
  type: ContentType;
};

/** A styled container for status messages. */
const Alert = React.forwardRef<HTMLDivElement, Props>(
  ({ type, vfx, className, ...rest }, ref) => (
    <Box
      {...rest}
      vfx={{ radius: "rounded", fontWeight: 4, padding: "m", ...vfx }}
      className={classNames(`aui-alert aui-content-${type}`, className)}
      ref={ref}
    />
  )
);

export default Alert;
