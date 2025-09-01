import React from "react";
import classNames from "../../functions/classNames";
import Box, { type BoxProps } from "../Box/Box";
import Icon from "../Icon";
import ui from "../ui";

type SelectProps = React.ComponentProps<typeof ui.select>;
type Props = Omit<BoxProps, "children"> & {
  /**
   * Array of options to display in the select
   */
  options: string[];
  /**
   * Mapper function to get the label of the option
   *
   * @param option the option to get the label of
   * @returns the label of the option
   */
  getOptionLabel?: (option: string) => string;
  /**
   * Props to pass to the underlying select element
   */
  selectProps?: SelectProps;
};

const Select = React.forwardRef<HTMLSelectElement, Props>(
  ({ className, options, vfx, getOptionLabel, selectProps, ...rest }, ref) => {
    const { className: selectClassName } = selectProps || {};
    return (
      <Box
        vfx={{
          pos: "relative",
          width: "fit",
          axis: "x",
          align: "center",
          radius: "rounded",
          backgroundColor: "default",
          color: "default",
          padding: "none",
          ...vfx,
        }}
        className={classNames(
          "aui-select-container",
          selectProps?.disabled ? "aui-select-disabled" : undefined,
          className
        )}
        {...rest}
      >
        <ui.select
          {...selectProps}
          className={classNames("aui-select", selectClassName)}
          ref={ref}
        >
          {options.map((option, index) => (
            <option key={index} value={option}>
              {getOptionLabel?.(option) || option}
            </option>
          ))}
        </ui.select>
        <Icon icon="chevron-down" className="aui-select-icon" aria-hidden />
      </Box>
    );
  }
);

export default Select;
