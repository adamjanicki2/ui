import React, { useEffect, useMemo, useRef, useState } from "react";
import type { ReadonlyableArray } from "../../types/common";
import Box from "../Box";
import { IconInput } from "../Input";
import Popover from "../Popover";

type PopoverProps = React.ComponentProps<typeof Popover>;
type IconInputProps = React.ComponentProps<typeof IconInput>;
type InputElementProps = NonNullable<IconInputProps["inputProps"]>;

type Props<T> = Omit<IconInputProps, "inputProps" | "onSelect"> & {
  /** The value of the input field */
  value: string;
  /**
   * Callback for when the input field changes.
   * @param event Standard React ChangeEvent.
   */
  onInputChange: (event: React.ChangeEvent<HTMLInputElement>) => void;
  /**
   * Callback for when an option is selected.
   * @param value Selected value.
   */
  onSelect: (value: T) => void;
  /** The list of available options */
  options: ReadonlyableArray<T>;
  /**
   * Predicate to filter options.
   * @param option Current option.
   * @returns True if the option should be displayed.
   */
  filterOption?: (option: T) => boolean;
  /**
   * Render function for the option.
   * @param option Current option.
   * @returns Node to render for the option.
   */
  renderOption?: (option: T) => React.ReactNode;
  /** Node to render when no options are available */
  noOptionsNode?: React.ReactNode;
  /**
   * Group options by a string.
   * @param option Current option.
   * @returns String to group by.
   */
  groupBy?: (option: T) => string;
  /**
   * Render function for the group.
   * @param group Name.
   * @returns Node to render for the group.
   */
  renderGroup?: (group: string) => React.ReactNode;
  /** Allow free text input by converting the query string to a value */
  customize?: (query: string) => T;
  /** Props to pass to the underlying `input` */
  inputProps?: Omit<InputElementProps, "value" | "onChange" | "autoComplete">;
  /** Props for the popover */
  popoverProps?: Omit<PopoverProps, "open" | "onClose" | "anchor" | "children">;
  /** Footer node to render at the bottom of the popover */
  footer?: React.ReactNode;
  /**
   * Close the popover when the footer is clicked.
   * @default true
   */
  closeOnFooterClick?: boolean;
  /** Callback fired when the user hits the Enter key while no option is selected */
  onUnselectedEnter?: () => void;
  /**
   * Whether or not to leave the popover open after a selection occurs.
   * @default false
   */
  remainOpenOnSelectOrEnter?: boolean;
};

const defaultRenderOption = <T,>(option: T) => (
  <Box vfx={{ padding: "s" }}>{`${option}`}</Box>
);

/** Searchable select input with an overlay menu */
const Autocomplete = <T,>(props: Props<T>) => {
  const {
    inputProps,
    options,
    renderOption = defaultRenderOption,
    filterOption = () => true,
    groupBy,
    renderGroup,
    noOptionsNode,
    customize,
    value,
    onInputChange,
    onSelect,
    popoverProps,
    footer,
    onUnselectedEnter,
    closeOnFooterClick = true,
    remainOpenOnSelectOrEnter = false,
    ...iconInputProps
  } = props;

  const anchorRef = useRef<HTMLDivElement | null>(null);
  const inputRef = useRef<HTMLInputElement | null>(null);
  const highlightedRef = useRef<HTMLDivElement | null>(null);

  const [highlightedIndex, setHighlightedIndex] = useState<number>();
  const [open, setOpen] = useState(false);

  const { filteredOptions, groupMap } = useMemo(() => {
    let filtered = options.filter(filterOption);
    const map = new Map<number, string>();

    if (groupBy) {
      const grouped = new Map<string, T[]>();
      for (const option of filtered) {
        const group = groupBy(option);
        const items = grouped.get(group);
        if (items) items.push(option);
        else grouped.set(group, [option]);
      }
      filtered = [];
      grouped.forEach((items, group) => {
        map.set(filtered.length, group);
        filtered.push(...items);
      });
    }

    return { filteredOptions: filtered, groupMap: map };
  }, [filterOption, groupBy, options]);

  const openMenu = () => setOpen(true);

  const closeMenu = () => {
    setHighlightedIndex(undefined);
    setOpen(false);
    inputRef.current?.blur();
  };

  const handleSelect = (selected: T) => {
    onSelect(selected);
    if (!remainOpenOnSelectOrEnter) closeMenu();
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setHighlightedIndex(undefined);
    onInputChange(e);
    if (e.target.value || options.length > 0) openMenu();
  };

  const handleInputFocus = (e: React.FocusEvent<HTMLInputElement>) => {
    inputProps?.onFocus?.(e);
    if (!e.defaultPrevented && !inputProps?.disabled) openMenu();
  };

  const showCustomOption = Boolean(customize && value.length > 0 && filteredOptions.length === 0);

  const selectCustom = () => {
    if (!customize) return;
    handleSelect(customize(value));
  };

  const handleKeyUp = (e: React.KeyboardEvent<HTMLDivElement>) => {
    const { code } = e;

    if (code === "Enter") {
      if (highlightedIndex !== undefined) {
        if (showCustomOption && highlightedIndex === filteredOptions.length) {
          selectCustom();
          return;
        }
        const selected = filteredOptions[highlightedIndex];
        if (selected !== undefined) handleSelect(selected);
        return;
      }

      if (showCustomOption) {
        selectCustom();
        return;
      }

      onUnselectedEnter?.();
      if (!remainOpenOnSelectOrEnter) closeMenu();
      return;
    }

    const optionCount = filteredOptions.length + (showCustomOption ? 1 : 0);
    if (optionCount <= 0) return;

    if (code === "ArrowDown") {
      setHighlightedIndex((index) => ((index ?? -1) + 1) % optionCount);
    } else if (code === "ArrowUp") {
      setHighlightedIndex(
        (index) => ((index ?? 0) - 1 + optionCount) % optionCount
      );
    }
  };

  useEffect(() => {
    if (highlightedIndex === undefined) return;
    highlightedRef.current?.scrollIntoView?.({
      block: "nearest",
      behavior: "smooth",
    });
  }, [highlightedIndex]);

  const popoverOpen = open && (filteredOptions.length > 0 || value.length > 0);

  const {
    style: popoverStyle,
    vfx: popoverVfx,
    flip = false,
    offset = 8,
    ...restPopoverProps
  } = popoverProps || {};

  const { onKeyUp: onKeyUpProp, ...restIconInputProps } = iconInputProps;

  return (
    <Popover
      {...restPopoverProps}
      flip={flip}
      offset={offset}
      open={popoverOpen}
      onClose={closeMenu}
      anchor={
        <IconInput
          {...restIconInputProps}
          ref={anchorRef}
          onKeyUp={(e) => {
            onKeyUpProp?.(e);
            if (e.defaultPrevented) return;
            handleKeyUp(e);
          }}
          inputProps={{
            ...inputProps,
            value,
            onChange: handleInputChange,
            onFocus: handleInputFocus,
            ref: inputRef,
            autoComplete: "off",
          }}
        />
      }
      vfx={{
        padding: "none",
        margin: "none",
        overflow: "hidden",
        fontWeight: 4,
        ...popoverVfx,
      }}
      style={{ ...popoverStyle, width: anchorRef.current?.offsetWidth }}
      animateFrom={{
        style: { opacity: 0, transform: `translateY(-${offset}px)` },
      }}
      animateTo={{ style: { opacity: 1, transform: "translateY(0)" } }}
    >
      <Box
        vfx={{ axis: "y", padding: "s", overflow: "scroll" }}
        style={{ maxHeight: 300 }}
        tabIndex={-1}
      >
        {filteredOptions.map((option, index) => {
          const group = groupMap.get(index);
          const highlighted = highlightedIndex === index;

          return (
            <React.Fragment key={index}>
              {group && (renderGroup?.(group) || group)}
              <Box
                vfx={{ axis: "x", cursor: "pointer", radius: "rounded" }}
                ref={highlighted ? highlightedRef : undefined}
                onMouseEnter={() => setHighlightedIndex(index)}
                className={
                  highlighted ? "aui-autocomplete-on-option" : undefined
                }
                onClick={() => handleSelect(option)}
              >
                {renderOption(option)}
              </Box>
            </React.Fragment>
          );
        })}
        {showCustomOption ? (
          <Box
            vfx={{ axis: "x", cursor: "pointer", radius: "rounded" }}
            ref={highlightedIndex === filteredOptions.length ? highlightedRef : undefined}
            onMouseEnter={() => setHighlightedIndex(filteredOptions.length)}
            className={
              highlightedIndex === filteredOptions.length
                ? "aui-autocomplete-on-option"
                : undefined
            }
            onClick={selectCustom}
          >
            {defaultRenderOption(value)}
          </Box>
        ) : filteredOptions.length ? null : (
          noOptionsNode || defaultRenderOption("No results found")
        )}
      </Box>
      {footer && (
        <Box onClick={closeOnFooterClick ? closeMenu : undefined}>{footer}</Box>
      )}
    </Popover>
  );
};

export default Autocomplete;
