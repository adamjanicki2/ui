import React, { forwardRef } from "react";
import { Props as InputProps } from "./Input";
import classNames from "../../functions/classNames";
import Box, { type BoxProps } from "../Box/Box";
import ui from "../ui";

type IconInputProps = Omit<BoxProps, "children"> & {
  /** Icon to display at the start of the input */
  startIcon?: React.ReactNode;
  /** Icon to display at the end of the input */
  endIcon?: React.ReactNode;
  /** Props to pass directly to the input element */
  inputProps?: InputProps;
};

/** An input wrapper with optional icons */
const IconInput = forwardRef<HTMLDivElement, IconInputProps>(
  ({ startIcon, endIcon, className, vfx, inputProps, ...rest }, ref) => {
    const {
      className: inputClassName,
      vfx: inputVfx,
      ...restInputProps
    } = inputProps || {};

    return (
      <Box
        vfx={{
          axis: "x",
          align: "center",
          radius: "rounded",
          overflow: "scroll",
          ...vfx,
        }}
        className={classNames(`aui-input`, className)}
        {...rest}
        ref={ref}
      >
        {startIcon}
        <ui.input
          {...restInputProps}
          vfx={{
            radius: "rounded",
            backgroundColor: "transparent",
            width: "full",
            ...inputVfx,
          }}
          className={classNames(`aui-input-base`, inputClassName)}
        />
        {endIcon}
      </Box>
    );
  }
);

export default IconInput;
