import React, { forwardRef } from "react";
import classNames from "../../functions/classNames";
import { CornerType } from "../../types";

type Props = Omit<
  React.DetailedHTMLProps<
    React.SelectHTMLAttributes<HTMLSelectElement>,
    HTMLSelectElement
  >,
  "aria-label"
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
  getOptionValue?: (option: string) => string;
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
  /**
   * Name of the select for accessibility purposes
   */
  "aria-label": string;
};

const identity = (x: string) => x;

const Select = (
  {
    className,
    options,
    getOptionValue = identity,
    getOptionLabel = identity,
    corners = "rounded",
    style,
    disabled,
    ...props
  }: Props,
  ref: React.Ref<HTMLSelectElement>
) => (
  <div
    className={
      classNames(
        "ajui-select-container",
        `corners--${corners}`,
        disabled ? "ajui-select-disabled" : undefined,
        className
      ) || undefined
    }
    style={style}
  >
    <select
      {...props}
      ref={ref}
      className={`ajui-select-base corners--${corners}`}
      disabled={disabled}
    >
      {options.map((option, index) => (
        <option key={index} value={getOptionValue(option)}>
          {getOptionLabel(option)}
        </option>
      ))}
    </select>
    <svg
      xmlns="http://www.w3.org/2000/svg"
      viewBox="0 0 64 64"
      className="ajui-select-triangle"
      aria-hidden="true"
    >
      <path
        fill="currentColor"
        d="M 29.175781 50.824219 C 30.738281 52.386719 33.273438 52.386719 34.835938 50.824219 L 58.835938 26.824219 C 60.398438 25.261719 60.398438 22.726562 58.835938 21.164062 C 57.273438 19.601562 54.738281 19.601562 53.175781 21.164062 L 32 42.335938 L 10.824219 21.175781 C 9.261719 19.613281 6.726562 19.613281 5.164062 21.175781 C 3.601562 22.738281 3.601562 25.273438 5.164062 26.835938 L 29.164062 50.835938 Z M 29.175781 50.824219"
      />
    </svg>
  </div>
);

export default forwardRef(Select);
