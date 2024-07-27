import React, { useEffect } from "react";
import { useFocusTrap, useScrollLock } from "../../hooks";
import { classNames } from "../../utils/util";

type Props = {
  /**
   * Callback that fires when the user clicks outside the layer
   */
  onClose: () => void;
  /**
   * The child of the layer.
   * IMPORTANT: the child must be able to accept a ref
   */
  children: React.ReactElement;
  /**
   * [Optional] Additional class name
   */
  backdropClassName?: string;
  /**
   * [Optional] Additional styles
   */
  backdropStyle?: React.CSSProperties;
  /**
   * [Optional] Whether to disable the escape key to close the layer
   * @default false
   */
  disableEscape?: boolean;
};

const Layer = ({
  onClose,
  children,
  backdropStyle = {},
  backdropClassName,
  disableEscape = false,
}: Props): JSX.Element | null => {
  const { lock, unlock } = useScrollLock();
  const focusRef = useFocusTrap<HTMLElement>(true);

  useEffect(() => {
    const handleEscape = (event: KeyboardEvent) => {
      if (event.key === "Escape") {
        onClose();
      }
    };

    if (!disableEscape) document.addEventListener("keydown", handleEscape);
    return () => {
      if (!disableEscape) document.removeEventListener("keydown", handleEscape);
    };
  }, [onClose, disableEscape]);

  useEffect(() => {
    lock();
    return unlock;
  }, [lock, unlock]);

  return (
    <div
      className={classNames("ajui-layer-backdrop", backdropClassName)}
      style={backdropStyle}
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

export default Layer;
