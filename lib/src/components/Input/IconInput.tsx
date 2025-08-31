import React, { forwardRef } from "react";
import { InputProps } from "./Input";
import classNames from "../../functions/classNames";
import type { CornerType, Style } from "../../utils/types";
import Box from "../Box";

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
  style?: Style;
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
    <Box
      fx={{ axis: "x", align: "center" }}
      className={classNames(
        `aui-input aui-icon-input aui-corners--${corners}`,
        className
      )}
      style={style}
      ref={ref}
    >
      {startIcon}
      <input
        {...inputProps}
        className={classNames(
          `aui-input-base aui-corners--${corners}`,
          inputProps?.className
        )}
      />
      {endIcon}
    </Box>
  )
);

export default IconInput;
