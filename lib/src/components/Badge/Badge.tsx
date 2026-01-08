import React from "react";

import classNames from "../../functions/classNames";
import type { ContentType } from "../../types/common";
import Box, { type BoxProps } from "../Box/Box";

type Props = BoxProps & {
  /** The type of badge to display */
  type: ContentType;
};

/** A small label for status */
const Badge = React.forwardRef<HTMLDivElement, Props>(
  ({ type, className, vfx, ...rest }, ref) => (
    <Box
      {...rest}
      vfx={{
        radius: "rounded",
        paddingY: "xxs",
        paddingX: "xs",
        fontWeight: 5,
        fontSize: "s",
        width: "fit",
        ...vfx,
      }}
      className={classNames(`aui-badge aui-content-${type}`, className)}
      ref={ref}
    />
  )
);

export default Badge;
