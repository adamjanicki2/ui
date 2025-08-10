import React, { forwardRef } from "react";
import { CornerType } from "../../types";
import classNames from "../../functions/classNames";

type Props = React.DetailedHTMLProps<
  React.InputHTMLAttributes<HTMLInputElement>,
  HTMLInputElement
> & {
  /**
   * Type of corners on the input
   * @default "rounded"
   */
  corners?: CornerType;
};

const Input = forwardRef<HTMLInputElement, Props>(
  ({ className, corners = "rounded", ...props }, ref) => (
    <input
      {...props}
      ref={ref}
      className={classNames(
        `ajui-input-base ajui-input-default corners--${corners}`,
        className
      )}
    />
  )
);

export type InputProps = React.ComponentProps<typeof Input>;

export default Input;
