import React, { forwardRef } from "react";
import { InputProps } from "./Input";
import classNames from "../../functions/classNames";
import { CornerType } from "../../types";

type IconInputProps = {
  /**
   * [Optional] Icon to display at the start of the input
   */
  startIcon?: React.ReactNode;
  /**
   * [Optional] Icon to display at the end of the input
   */
  endIcon?: React.ReactNode;
  /**
   * [Optional] Class name to add to the container
   */
  className?: string;
  /**
   * [Optional] Inline styles to add to the container
   */
  style?: React.CSSProperties;
  /**
   * [Optional] Corner style for the input
   */
  corners?: CornerType;
  /**
   * [Optional] Props to pass directly to the input element
   */
  inputProps?: Omit<InputProps, "corners">;
};

const IconInput = forwardRef<HTMLDivElement, IconInputProps>(
  (
    { startIcon, endIcon, className, style, corners = "rounded", inputProps },
    ref
  ) => (
    <div
      className={classNames(
        `ajui-input-default ajui-icon-input corners--${corners}`,
        className
      )}
      style={style}
      ref={ref}
    >
      {startIcon || null}
      <input
        {...inputProps}
        className={classNames(
          `ajui-input-base corners--${corners}`,
          inputProps?.className
        )}
      />
      {endIcon || null}
    </div>
  )
);

export default IconInput;
