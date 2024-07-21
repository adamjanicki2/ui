import React, { forwardRef } from "react";
import { CornerType } from "../../utils/types";
import { classNames } from "../../utils/util";

export type InputProps = React.DetailedHTMLProps<
  React.InputHTMLAttributes<HTMLInputElement>,
  HTMLInputElement
> & {
  /**
   * Type of corners on the input
   * @default "rounded"
   */
  corners?: CornerType;
};

const Input = forwardRef<HTMLInputElement, InputProps>(
  ({ className, corners = "rounded", ...props }, ref) => (
    <input
      {...props}
      ref={ref}
      className={classNames(
        `ajcc-input-base ajcc-input-default corners--${corners}`,
        className
      )}
    />
  )
);

export default Input;
