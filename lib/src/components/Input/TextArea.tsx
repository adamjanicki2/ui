import React, { forwardRef } from "react";
import classNames from "../../functions/classNames";
import ui from "../ui";

type Props = React.ComponentProps<typeof ui.textarea>;

const TextArea = forwardRef<HTMLTextAreaElement, Props>(
  ({ className, rows = 3, fx, ...props }, ref) => (
    <ui.textarea
      {...props}
      ref={ref}
      className={classNames(`aui-input-base aui-input`, className)}
      fx={{ radius: "rounded", ...fx }}
      rows={rows}
    />
  )
);

export default TextArea;
