import React from "react";

import classNames from "../../functions/classNames";
import { select } from "../../icons";
import type { ReadonlyableArray } from "../../types/common";
import Box, { type BoxProps } from "../Box/Box";
import Icon from "../Icon";
import ui from "../ui";

type Props<T extends string> = Omit<BoxProps, "children" | "onSelect"> & {
  /**
   * Mapper function to get the label of the option.
   *
   * @param option The option to get the label of.
   * @returns The label of the option.
   */
  getOptionLabel?: (option: T) => string;
  /** Callback that fires on change */
  onSelect?: (option: T) => void;
  /** Array of options to display in the select */
  options: ReadonlyableArray<T>;
  /** Props to pass to the underlying select element */
  selectProps?: Omit<
    React.ComponentProps<typeof ui.select>,
    "onChange" | "value" | "children"
  >;
  /** Current value of the select */
  value?: T;
};

/** A styled `select` component */
const Select = <T extends string>({
  className,
  options,
  vfx,
  getOptionLabel,
  selectProps,
  value,
  onSelect,
  ...rest
}: Props<T>) => (
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
      onChange={onSelect ? (e) => onSelect(e.target.value as T) : undefined}
      className={classNames("aui-select", selectProps?.className)}
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

export default Select;
