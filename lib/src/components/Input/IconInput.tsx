import React, { forwardRef } from "react";
import { Props as InputProps } from "./Input";
import classNames from "../../functions/classNames";
import Box, { type BoxProps } from "../Box/Box";
import ui from "../ui";

type IconInputProps = Omit<BoxProps, "children"> & {
  /**
   * [Optional] Icon to display at the start of the input
   */
  startIcon?: React.ReactNode;
  /**
   * [Optional] Icon to display at the end of the input
   */
  endIcon?: React.ReactNode;
  /**
   * [Optional] Props to pass directly to the input element
   */
  inputProps?: InputProps;
};

const IconInput = forwardRef<HTMLDivElement, IconInputProps>(
  ({ startIcon, endIcon, className, fx, inputProps, ...rest }, ref) => {
    const {
      className: inputClassName,
      fx: inputFx,
      ...restInputProps
    } = inputProps || {};

    return (
      <Box
        fx={{ axis: "x", align: "center", radius: "rounded", ...fx }}
        className={classNames(`aui-input aui-icon-input`, className)}
        {...rest}
        ref={ref}
      >
        {startIcon}
        <ui.input
          {...restInputProps}
          fx={{ radius: "rounded", ...inputFx }}
          className={classNames(`aui-input-base`, inputClassName)}
        />
        {endIcon}
      </Box>
    );
  }
);

export default IconInput;
