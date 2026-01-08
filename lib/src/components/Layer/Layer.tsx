import React, { useEffect } from "react";

import classNames from "../../functions/classNames";
import { useFocusTrap, useScrollLock } from "../../hooks";
import useMergeRefs from "../../hooks/useMergeRefs";
import Box, { type BoxProps } from "../Box/Box";

type Props = Omit<BoxProps, "children"> & {
  /** Callback that fires when the user clicks outside the layer */
  onClose?: () => void;
  /**
   * The child of the layer.
   * IMPORTANT: the child must be able to accept a ref.
   */
  children: React.ReactElement<any>;
  /**
   * Whether to return focus to the element that triggered the layer.
   * @default false
   */
  returnFocusOnEscape?: boolean;
  /**
   * Disable the scroll lock behavior of the layer.
   * @default false
   */
  disableScrollLock?: boolean;
};

/** A focus-trapped backdrop that closes on click outside */
const Layer = React.forwardRef<HTMLDivElement, Props>(
  (
    {
      returnFocusOnEscape,
      disableScrollLock,
      onClose,
      children,
      className,
      onMouseDown,
      vfx,
      ...rest
    },
    ref
  ) => {
    const focusRef = useFocusTrap<HTMLElement>(true);
    // Lock and unlock on mount and unmount
    useScrollLock(!disableScrollLock);

    useEffect(() => {
      const handleEscape = (event: KeyboardEvent) => {
        if (event.key !== "Escape") return;
        if (!returnFocusOnEscape)
          (document.activeElement as HTMLElement | null)?.blur?.();
        onClose?.();
      };

      document.addEventListener("keydown", handleEscape);
      return () => document.removeEventListener("keydown", handleEscape);
    }, [onClose, returnFocusOnEscape]);

    const mergedRef = useMergeRefs(focusRef, children.props.ref);

    return (
      <Box
        vfx={{
          axis: "y",
          align: "center",
          justify: "center",
          z: "max",
          ...vfx,
        }}
        {...rest}
        className={classNames("aui-layer-backdrop", className)}
        onMouseDown={(e) => {
          onMouseDown?.(e);
          onClose?.();
        }}
        ref={ref}
      >
        {React.cloneElement(children, {
          ref: mergedRef,
          onMouseDown: (e: React.SyntheticEvent) => {
            e.stopPropagation();
            children.props?.onMouseDown?.(e);
          },
        })}
      </Box>
    );
  }
);

export default Layer;
