import React, { forwardRef } from "react";
import classNames from "../../functions/classNames";
import ui from "../../ui";

export type Props = React.ComponentProps<typeof ui.input>;

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
