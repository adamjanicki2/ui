import React, { forwardRef } from "react";
import { CornerType } from "../../types";
import classNames from "../../functions/classNames";

type TextAreaProps = React.DetailedHTMLProps<
  React.TextareaHTMLAttributes<HTMLTextAreaElement>,
  HTMLTextAreaElement
> & {
  /**
   * Type of corners on the text area
   * @default "rounded"
   */
  corners?: CornerType;
};

const TextArea = forwardRef<HTMLTextAreaElement, TextAreaProps>(
  ({ className, rows = 3, corners = "rounded", ...props }, ref) => (
    <textarea
      {...props}
      ref={ref}
      className={classNames(
        `ajui-input-base ajui-input-default corners--${corners}`,
        className
      )}
      rows={rows}
    />
  )
);

export default TextArea;
