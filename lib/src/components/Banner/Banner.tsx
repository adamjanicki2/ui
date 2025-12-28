import React from "react";
import type { ContentType } from "../../utils/types";
import classNames from "../../functions/classNames";
import Box, { type BoxProps } from "../Box/Box";

type Props = BoxProps & {
  /**
   * The type of banner to display.
   */
  type: ContentType;
};

const Banner = React.forwardRef<HTMLDivElement, Props>(
  ({ type, className, vfx, ...rest }, ref) => (
    <Box
      {...rest}
      vfx={{
        fontWeight: 4,
        paddingY: "l",
        paddingX: "xl",
        width: "full",
        ...vfx,
      }}
      className={classNames(`aui-content-${type}`, className)}
      ref={ref}
    />
  )
);

export default Banner;
