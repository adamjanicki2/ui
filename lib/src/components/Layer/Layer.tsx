import React, { useEffect } from "react";
import { useFocusTrap, useScrollLock } from "../../hooks";
import classNames from "../../functions/classNames";
import type { DivProps } from "../../types";

type Props<T extends React.ElementType> = Omit<DivProps, "children"> & {
  /**
   * Callback that fires when the user clicks outside the layer
   */
  onClose?: () => void;
  /**
   * The child of the layer.
   * IMPORTANT: the child must be able to accept a ref
   */
  children: React.ReactElement<React.ComponentPropsWithRef<T>>;
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

type BaseProps<T extends React.ElementType> = Omit<
  Props<T>,
  "disableScrollLock" | "returnFocusOnEscape"
> & {
  visible: boolean;
};

const BaseLayer = <T extends React.ElementType>({
  onClose,
  children,
  style,
  className,
  disableEscape = false,
  visible,
}: BaseProps<T>): React.JSX.Element => {
  const focusRef = useFocusTrap<HTMLElement>(visible);

  useEffect(() => {
    const handleEscape = (event: KeyboardEvent) => {
      if (event.key === "Escape") {
        onClose?.();
      }
    };

    if (!disableEscape) document.addEventListener("keydown", handleEscape);
    return () => {
      if (!disableEscape) document.removeEventListener("keydown", handleEscape);
    };
  }, [onClose, disableEscape]);

  return (
    <div
      className={classNames("aui-layer-backdrop", className)}
      style={style}
      onMouseDown={onClose}
    >
      {React.cloneElement(children, {
        ref: focusRef,
        onMouseDown: (e: React.SyntheticEvent) => {
          e.stopPropagation();
          children.props?.onMouseDown?.(e);
        },
      } as any)}
    </div>
  );
};

const Layer = <T extends React.ElementType>({
  returnFocusOnEscape,
  disableScrollLock,
  ...props
}: Props<T>): React.JSX.Element => {
  // Lock and unlock on mount and unmount
  useScrollLock(!disableScrollLock);

  useEffect(() => {
    return () => {
      const activeEl = document.activeElement as HTMLElement;
      if (!returnFocusOnEscape) {
        activeEl?.blur?.();
      }
    };
  }, [returnFocusOnEscape]);

  return <BaseLayer {...props} visible />;
};

export default Layer;
