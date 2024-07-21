import React, { forwardRef } from "react";
import { CornerType } from "../../utils/types";
import { classNames } from "../../utils/util";

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
        `ajcc-input-base ajcc-input-default corners--${corners}`,
        className
      )}
      rows={rows}
    />
  )
);

export default TextArea;
