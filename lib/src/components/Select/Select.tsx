import React, { forwardRef } from "react";
import classNames from "../../functions/classNames";
import type { CornerType } from "../../utils/types";
import Box from "../Box";
import Icon from "../Icon";

type Props = React.DetailedHTMLProps<
  React.SelectHTMLAttributes<HTMLSelectElement>,
  HTMLSelectElement
> & {
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
   * [Optional] The corner style of the select element.
   * @default "rounded"
   */
  corners?: CornerType;
};

const Select = (
  {
    className,
    options,
    getOptionLabel,
    corners = "rounded",
    style,
    disabled,
    ...props
  }: Props,
  ref: React.Ref<HTMLSelectElement>
) => (
  <Box
    className={classNames(
      "aui-select-container",
      `aui-corners--${corners}`,
      disabled ? "aui-select-disabled" : undefined,
      className
    )}
    style={style}
  >
    <select
      {...props}
      ref={ref}
      className={`aui-select aui-corners--${corners}`}
      disabled={disabled}
    >
      {options.map((option, index) => (
        <option key={index} value={option}>
          {getOptionLabel?.(option) || option}
        </option>
      ))}
    </select>
    <Icon icon="down" className="aui-select-icon" aria-hidden />
  </Box>
);

export default forwardRef(Select);
