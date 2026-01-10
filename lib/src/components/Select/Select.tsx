import React from "react";

import classNames from "../../functions/classNames";
import { select } from "../../icons";
import type { ReadonlyableArray } from "../../types/common";
import Box, { type BoxProps } from "../Box/Box";
import Icon from "../Icon";
import ui from "../ui";

type SelectProps = React.ComponentProps<typeof ui.select>;
type Props = Omit<BoxProps, "children" | "onChange"> & {
  /**
   * Mapper function to get the label of the option.
   *
   * @param option The option to get the label of.
   * @returns The label of the option.
   */
  getOptionLabel?: (option: string) => string;
  /** Change handler for the select */
  onChange?: SelectProps["onChange"];
  /** Array of options to display in the select */
  options: ReadonlyableArray<string>;
  /** Props to pass to the underlying select element */
  selectProps?: Omit<SelectProps, "onChange" | "value">;
  /** Current value of the select */
  value?: SelectProps["value"];
};

/** A styled `select` component */
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
        <Icon
          icon={select}
          vfx={{ color: "muted", pos: "absolute" }}
          style={{
            top: "50%",
            right: 10,
            transform: "translateY(-50%)",
            pointerEvents: "none",
          }}
          size="xs"
          aria-hidden
        />
      </Box>
    );
  }
);

export default Select;
