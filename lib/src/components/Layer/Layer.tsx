import React, { useEffect } from "react";
import { useFocusTrap, useScrollLock } from "../../hooks";
import classNames from "../../functions/classNames";
import Box, { type BoxProps } from "../Box/Box";

type Props = Omit<BoxProps, "children"> & {
  /**
   * Callback that fires when the user clicks outside the layer
   */
  onClose?: () => void;
  /**
   * The child of the layer.
   * IMPORTANT: the child must be able to accept a ref
   */
  children: React.ReactElement<any>;
  /**
   * [Optional] Whether to disable the escape key to close the layer
   * @default false
   */
  disableEscape?: boolean;
  /**
   * [Optional] Whether to return focus to the element that triggered the layer
   * @default false
   */
  returnFocusOnEscape?: boolean;
  /**
   * [Optional] disable the scroll lock behavior of the layer
   * @default false
   */
  disableScrollLock?: boolean;
};

const Layer = React.forwardRef<HTMLDivElement, Props>(
  (
    {
      returnFocusOnEscape,
      disableScrollLock,
      onClose,
      children,
      className,
      disableEscape = false,
      onMouseDown,
      layout,
      ...rest
    },
    ref
  ) => {
    const focusRef = useFocusTrap<HTMLElement>(true);
    // Lock and unlock on mount and unmount
    useScrollLock(!disableScrollLock);

    useEffect(() => {
      if (disableEscape) return;

      const handleEscape = (event: KeyboardEvent) => {
        if (event.key === "Escape") {
          if (!returnFocusOnEscape) {
            const activeEl = document.activeElement as HTMLElement | null;
            activeEl?.blur?.();
          }

          onClose?.();
        }
      };

      document.addEventListener("keydown", handleEscape);

      return () => {
        document.removeEventListener("keydown", handleEscape);
      };
    }, [onClose, disableEscape, returnFocusOnEscape]);

    return (
      <Box
        layout={{ axis: "y", align: "center", justify: "center", ...layout }}
        {...rest}
        className={classNames("aui-layer-backdrop", className)}
        onMouseDown={(e) => {
          onMouseDown?.(e);
          onClose?.();
        }}
        ref={ref}
      >
        {React.cloneElement(children, {
          ref: focusRef,
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
