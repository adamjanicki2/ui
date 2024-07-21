import React, { forwardRef } from "react";
import { classNames } from "../../utils/util";
import { CornerType } from "../../utils/types";

type Props = React.DetailedHTMLProps<
  React.SelectHTMLAttributes<HTMLSelectElement>,
  HTMLSelectElement
> & {
  /**
   * Array of options to display in the select
   */
  options: string[];
  /**
   * Mapper function to get the value of the option
   *
   * @param option the option to get the value of
   * @returns the value of the option
   */
  getOptionValue: (option: string) => string;
  /**
   * Mapper function to get the label of the option
   *
   * @param option the option to get the label of
   * @returns the label of the option
   */
  getOptionLabel: (option: string) => string;
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
    getOptionValue,
    getOptionLabel,
    corners = "rounded",
    ...props
  }: Props,
  ref: React.Ref<HTMLSelectElement>
) => (
  <select
    {...props}
    ref={ref}
    className={classNames(`ajcc-select-base corners--${corners}`, className)}
  >
    {options.map((option, index) => (
      <option key={index} value={getOptionValue(option)}>
        {getOptionLabel(option)}
      </option>
    ))}
  </select>
);

export default forwardRef(Select);
