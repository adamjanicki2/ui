import React from "react";

import classNames from "../../functions/classNames";
import type { SignalType, Vfx } from "../../types/common";
import Box, { type BoxProps } from "../Box/Box";

type Props = BoxProps & {
  /** The type/theme of signal to display */
  type: SignalType;
};

const makeSignal = (baseVfx: Vfx) =>
  React.forwardRef<HTMLDivElement, Props>(
    ({ type, className, vfx, ...rest }, ref) => (
      <Box
        {...rest}
        vfx={{ ...baseVfx, ...vfx }}
        className={classNames(`aui-content-${type}`, className)}
        ref={ref}
      />
    )
  );

/** A styled container for status messages */
export const Alert = makeSignal({
  radius: "rounded",
  fontWeight: 4,
  padding: "m",
  border: true,
});

/** A small label for status */
export const Badge = makeSignal({
  radius: "rounded",
  paddingY: "xxs",
  paddingX: "xs",
  fontWeight: 5,
  fontSize: "s",
  width: "fit",
  border: true,
});

/** A full-width banner for page-level messages */
export const Banner = makeSignal({
  fontWeight: 4,
  paddingY: "l",
  paddingX: "xl",
  width: "full",
});
