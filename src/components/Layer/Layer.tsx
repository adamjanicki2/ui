import React, { useEffect } from "react";
import { useFocusTrap, useScrollLock } from "../../hooks";
import { classNames } from "../../utils/util";

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
      onClick={onClose}
    >
      {React.cloneElement(children, {
        ref: focusRef,
        onClick: (e: React.SyntheticEvent) => {
          e.stopPropagation();
          children.props.onClick?.(e);
        },
      })}
    </div>
  );
};

const Layer = (props: LayerProps): JSX.Element => {
  // Lock and unlock on mount and unmount
  useScrollLock();

  return <BaseLayer {...props} visible />;
};

export default Layer;
