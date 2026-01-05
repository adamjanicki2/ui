import React, {
  useCallback,
  useEffect,
  useMemo,
  useRef,
  useState,
} from "react";
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
  /** Allow free text input */
  customize?: boolean;
  /** Props to pass to the underlying `input` */
  inputProps?: Omit<
    InputElementProps,
    "value" | "onChange" | "ref" | "autoComplete"
  >;
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
    customize = false,
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
      const uniqueGroups: string[] = [];
      const seen = new Set<string>();
      for (const option of filtered) {
        const group = groupBy(option);
        if (!seen.has(group)) {
          seen.add(group);
          uniqueGroups.push(group);
        }
      }

      let offset = 0;
      filtered = uniqueGroups.flatMap((group) => {
        const groupItems = filtered.filter(
          (option) => groupBy(option) === group
        );
        map.set(offset, group);
        offset += groupItems.length;
        return groupItems;
      });
    }

    if (customize && value.length > 0 && filtered.length === 0) {
      filtered = [...filtered, value as T];
    }

    return { filteredOptions: filtered, groupMap: map };
  }, [customize, filterOption, groupBy, options, value]);

  const openMenu = useCallback(() => setOpen(true), []);

  const closeMenu = useCallback(() => {
    setHighlightedIndex(undefined);
    setOpen(false);
    inputRef.current?.blur();
  }, []);

  const handleSelect = useCallback(
    (selected: T) => {
      onSelect(selected);
      if (!remainOpenOnSelectOrEnter) closeMenu();
    },
    [closeMenu, onSelect, remainOpenOnSelectOrEnter]
  );

  const handleInputChange = useCallback(
    (e: React.ChangeEvent<HTMLInputElement>) => {
      setHighlightedIndex(undefined);
      onInputChange(e);
      if (e.target.value || options.length > 0) openMenu();
    },
    [onInputChange, openMenu, options.length]
  );

  const handleInputFocus = useCallback(
    (e: React.FocusEvent<HTMLInputElement>) => {
      inputProps?.onFocus?.(e);
      if (e.defaultPrevented) return;
      if (inputProps?.disabled) return;
      openMenu();
    },
    [inputProps, openMenu]
  );

  const handleKeyUp = useCallback(
    (e: React.KeyboardEvent<HTMLDivElement>) => {
      const { code } = e;

      if (code === "Enter") {
        if (highlightedRef.current) {
          const child = highlightedRef.current.firstChild as HTMLElement | null;
          child?.click?.();
          return;
        }

        onUnselectedEnter?.();
        if (!remainOpenOnSelectOrEnter) closeMenu();
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
    },
    [
      closeMenu,
      filteredOptions.length,
      onUnselectedEnter,
      remainOpenOnSelectOrEnter,
    ]
  );

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
      style={{
        ...popoverStyle,
        width: anchorRef.current?.offsetWidth,
      }}
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
        {filteredOptions.length
          ? filteredOptions.map((option, index) => {
              const group = groupMap.get(index);
              const ref =
                index === highlightedIndex ? highlightedRef : undefined;

              return (
                <React.Fragment key={index}>
                  {group && (renderGroup?.(group) || group)}
                  <Box
                    vfx={{ axis: "x", cursor: "pointer", radius: "rounded" }}
                    ref={ref}
                    onMouseEnter={() => setHighlightedIndex(index)}
                    className={
                      highlightedIndex === index
                        ? "aui-autocomplete-on-option"
                        : undefined
                    }
                    onClick={() => handleSelect(option)}
                  >
                    {renderOption(option)}
                  </Box>
                </React.Fragment>
              );
            })
          : customize
          ? null
          : noOptionsNode || defaultRenderOption("No results found")}
      </Box>
      {footer && (
        <Box onClick={closeOnFooterClick ? closeMenu : undefined}>{footer}</Box>
      )}
    </Popover>
  );
};

export default Autocomplete;
