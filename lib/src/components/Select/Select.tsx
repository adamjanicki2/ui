import React from "react";
import classNames from "../../functions/classNames";
import Box, { type BoxProps } from "../Box/Box";
import Icon from "../Icon";
import ui from "../ui";
import type { ArrayLike } from "../../utils/types";

type SelectProps = React.ComponentProps<typeof ui.select>;
type Props = Omit<BoxProps, "children" | "onChange"> & {
  /**
   * Array of options to display in the select
   */
  options: ArrayLike<string>;
  /**
   * Mapper function to get the label of the option
   *
   * @param option the option to get the label of
   * @returns the label of the option
   */
  getOptionLabel?: (option: string) => string;
  /**
   * Current value of the select
   */
  value?: SelectProps["value"];
  /**
   * Change handler for the select
   */
  onChange?: SelectProps["onChange"];
  /**
   * Props to pass to the underlying select element
   */
  selectProps?: Omit<SelectProps, "value" | "onChange">;
};

const Select = React.forwardRef<HTMLSelectElement, Props>(
  (
    {
      className,
      options,
      vfx,
      getOptionLabel,
      selectProps,
      value,
      onChange,
      ...rest
    },
    ref
  ) => {
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
          value={value}
          onChange={onChange}
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
