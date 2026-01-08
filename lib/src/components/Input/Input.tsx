import React, { forwardRef } from "react";

import classNames from "../../functions/classNames";
import ui from "../ui";

/** Props for `Input` */
export type Props = React.ComponentProps<typeof ui.input>;

/** A styled `input` component */
const Input = forwardRef<HTMLInputElement, Props>(
  ({ className, vfx, ...props }, ref) => (
    <ui.input
      {...props}
      ref={ref}
      vfx={{ radius: "rounded", ...vfx }}
      className={classNames(`aui-input-base aui-input`, className)}
    />
  )
);

export default Input;
