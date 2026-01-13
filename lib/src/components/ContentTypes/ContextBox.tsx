import React from "react";

import classNames from "../../functions/classNames";
import type { ContentType, Vfx } from "../../types/common";
import Box, { type BoxProps } from "../Box/Box";

type ContentBoxProps = BoxProps & {
  /** The type of content to display */
  type: ContentType;
};

const createContentComponent = (baseClassName: string, defaultVfx: Vfx) =>
  React.forwardRef<HTMLDivElement, ContentBoxProps>(
    ({ type, className, vfx, ...rest }, ref) => (
      <Box
        {...rest}
        vfx={{ ...defaultVfx, ...vfx }}
        className={classNames(
          baseClassName || null,
          `aui-content-${type}`,
          className
        )}
        ref={ref}
      />
    )
  );

/** A styled container for status messages */
export const Alert = createContentComponent("aui-alert", {
  radius: "rounded",
  fontWeight: 4,
  padding: "m",
});

/** A small label for status */
export const Badge = createContentComponent("aui-badge", {
  radius: "rounded",
  paddingY: "xxs",
  paddingX: "xs",
  fontWeight: 5,
  fontSize: "s",
  width: "fit",
});

/** A full-width banner for page-level messages */
export const Banner = createContentComponent("", {
  fontWeight: 4,
  paddingY: "l",
  paddingX: "xl",
  width: "full",
});
