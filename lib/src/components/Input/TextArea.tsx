import React, { forwardRef } from "react";
import classNames from "../../functions/classNames";
import ui from "../ui";

type Props = React.ComponentProps<typeof ui.textarea>;

/** A styled `textarea` component */
const TextArea = forwardRef<HTMLTextAreaElement, Props>(
  ({ className, rows = 3, vfx, ...props }, ref) => (
    <ui.textarea
      {...props}
      ref={ref}
      className={classNames(`aui-input-base aui-input`, className)}
      vfx={{ radius: "rounded", ...vfx }}
      rows={rows}
    />
  )
);

export default TextArea;
