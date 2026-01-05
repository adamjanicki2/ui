import React, { useEffect, useMemo, useRef, useState } from "react";
import type { ReadonlyableArray } from "../../types/common";
import Box from "../Box";
import { IconInput } from "../Input";
import Popover from "../Popover";

type PopoverProps = React.ComponentProps<typeof Popover>;
type IconInputProps = React.ComponentProps<typeof IconInput>;
type InputElementProps = NonNullable<IconInputProps["inputProps"]>;

export type ChangeReason = "select" | "enter" | "clear";

export type AutocompleteProps<T> = {
  /** The list of available options */
  options: ReadonlyableArray<T>;
  /** Currently selected value */
  value: T | null;
  /** Fired when the selected value changes */
  onChange: (
    value: T | null,
    info: { reason: ChangeReason; option?: T }
  ) => void;
  /** Current query text value */
  query: string;
  /** Set the query text value */
  setQuery: (query: string) => void;
  /** Allow selecting arbitrary text being typed in */
  customize?: boolean;
  /** Fired when an arbitrary query is selected via customize */
  onCustomSelect?: (query: string, info: { reason: ChangeReason }) => void;
  /** Get display label for an option */
  getOptionLabel?: (option: T) => string;
  /** Determine if two options are equal (used for selected state) */
  isOptionEqual?: (a: T, b: T) => boolean;
  /** Predicate to filter options */
  filterOption?: (option: T, query: string) => boolean;
  /** Render function for a normal option */
  renderOption?: (
    option: T,
    state: { highlighted: boolean; selected: boolean }
  ) => React.ReactNode;
  /** Render function for the customize option */
  renderCustomOption?: (query: string) => React.ReactNode;
  /** Node to render when no options are available */
  noOptionsNode?: React.ReactNode;
  /** Group options by a string. */
  groupBy?: (option: T) => string;
  /** Render function for the group. */
  renderGroup?: (group: string) => React.ReactNode;
  /**
   * Close the popover when a selection occurs.
   * @default true
   */
  closeOnSelect?: boolean;
  /** Props to pass to the underlying `input` */
  inputProps?: Omit<
    InputElementProps,
    "value" | "onChange" | "ref" | "autoComplete"
  >;
  /** Props to pass to the IconInput wrapper */
  iconInputProps?: Omit<IconInputProps, "inputProps">;
  /** Props for the popover */
  popoverProps?: Omit<
    PopoverProps,
    "open" | "onClose" | "anchor" | "children" | "placement"
  >;
  /** Footer node to render at the bottom of the popover */
  footer?: React.ReactNode;
  /**
   * Close the popover when the footer is clicked.
   * @default true
   */
  closeOnFooterClick?: boolean;
};

const defaultRenderOption = (label: string) => (
  <Box vfx={{ padding: "s" }}>{label}</Box>
);

/** Searchable select input with an overlay menu */
const Autocomplete = <T,>(props: AutocompleteProps<T>) => {
  const {
    options,
    value,
    onChange,
    query,
    setQuery,
    customize,
    onCustomSelect,
    getOptionLabel,
    isOptionEqual,
    filterOption,
    renderOption,
    renderCustomOption,
    groupBy,
    renderGroup,
    noOptionsNode,
    closeOnSelect = true,
    inputProps,
    iconInputProps,
    popoverProps,
    footer,
    closeOnFooterClick = true,
  } = props;

  const anchorRef = useRef<HTMLDivElement | null>(null);
  const inputRef = useRef<HTMLInputElement | null>(null);
  const highlightedRef = useRef<HTMLDivElement | null>(null);

  const [highlightedIndex, setHighlightedIndex] = useState<number>();
  const [open, setOpen] = useState(false);

  const { filteredOptions, groupMap } = useMemo(() => {
    const getLabel = (option: T) => getOptionLabel?.(option) ?? `${option}`;
    const filter =
      filterOption ??
      ((option: T, input: string) =>
        getLabel(option).toLowerCase().includes(input.toLowerCase()));

    let filtered = options.filter((option) => filter(option, query));
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
  }, [filterOption, getOptionLabel, groupBy, options, query]);

  const openMenu = () => setOpen(true);

  const closeMenu = () => {
    setHighlightedIndex(undefined);
    setOpen(false);
    inputRef.current?.blur();
  };

  const selectCustom = (reason: ChangeReason) => {
    if (!customize || !query) return;
    onCustomSelect?.(query, { reason });
    if (closeOnSelect) closeMenu();
  };

  const selectOption = (selected: T, reason: ChangeReason) => {
    onChange(selected, { reason, option: selected });
    setQuery(getOptionLabel?.(selected) ?? `${selected}`);
    if (closeOnSelect) closeMenu();
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setHighlightedIndex(undefined);
    setQuery(e.target.value);
    if (e.target.value || options.length > 0) openMenu();
  };

  const handleInputFocus = (e: React.FocusEvent<HTMLInputElement>) => {
    inputProps?.onFocus?.(e);
    if (!e.defaultPrevented && !inputProps?.disabled) openMenu();
  };

  const handleKeyUp = (e: React.KeyboardEvent<HTMLDivElement>) => {
    const { code } = e;

    if (code === "Enter") {
      if (highlightedIndex !== undefined) {
        const selected = filteredOptions[highlightedIndex];
        if (selected !== undefined) selectOption(selected, "select");
        return;
      }

      selectCustom("enter");
      return;
    }

    const optionCount = filteredOptions.length;
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
    if (highlightedIndex !== undefined)
      highlightedRef.current?.scrollIntoView?.({
        block: "nearest",
        behavior: "smooth",
      });
  }, [highlightedIndex]);

  const popoverOpen = open && (filteredOptions.length > 0 || query.length > 0);
  const showCustomOption = Boolean(
    customize && query && filteredOptions.length === 0
  );

  const {
    style: popoverStyle,
    vfx: popoverVfx,
    flip = false,
    offset = 8,
    ...restPopoverProps
  } = popoverProps || {};

  const { onKeyUp: onKeyUpProp, ...restIconInputProps } = iconInputProps || {};

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
            value: query,
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
          const selected = value
            ? isOptionEqual?.(value, option) ?? value === option
            : false;
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
                onClick={() => selectOption(option, "select")}
              >
                {renderOption?.(option, { highlighted, selected }) ??
                  defaultRenderOption(getOptionLabel?.(option) ?? `${option}`)}
              </Box>
            </React.Fragment>
          );
        })}
        {!filteredOptions.length &&
          (showCustomOption ? (
            <Box
              vfx={{ axis: "x", cursor: "pointer", radius: "rounded" }}
              onClick={() => selectCustom("select")}
            >
              {renderCustomOption?.(query) ?? defaultRenderOption(query)}
            </Box>
          ) : (
            noOptionsNode || defaultRenderOption("No results found")
          ))}
      </Box>
      {footer && (
        <Box onClick={closeOnFooterClick ? closeMenu : undefined}>{footer}</Box>
      )}
    </Popover>
  );
};

export default Autocomplete;
