import React, { useEffect } from "react";
import { useFocusTrap, useScrollLock } from "../../hooks";
import classNames from "../../functions/classNames";

type LayerProps = {
  /**
   * Callback that fires when the user clicks outside the layer
   */
  onClose?: () => void;
  /**
   * The child of the layer.
   * IMPORTANT: the child must be able to accept a ref
   */
  children: React.ReactElement;
  /**
   * [Optional] Additional class name
   */
  className?: string;
  /**
   * [Optional] Additional styles
   */
  style?: React.CSSProperties;
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
};

const BaseLayer = ({
  onClose,
  children,
  style,
  className,
  disableEscape = false,
  visible,
}: LayerProps & { visible: boolean }): JSX.Element => {
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
      className={classNames("ajui-layer-backdrop", className)}
      style={style}
      onMouseDown={onClose}
    >
      {React.cloneElement(children, {
        ref: focusRef,
        onMouseDown: (e: React.SyntheticEvent) => {
          e.stopPropagation();
          children.props.onMouseDown?.(e);
        },
      })}
    </div>
  );
};

const Layer = ({
  returnFocusOnEscape = false,
  ...props
}: LayerProps): JSX.Element => {
  // Lock and unlock on mount and unmount
  useScrollLock();

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
