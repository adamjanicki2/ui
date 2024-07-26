import React, { useEffect } from "react";
import { useFocusTrap, useScrollLock } from "../../hooks";
import { classNames } from "../../utils/util";

type Props = {
  /**
   * Whether the layer is open or not
   */
  open: boolean;
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
};

const Modal = ({
  open,
  onClose,
  children,
  backdropStyle = {},
  backdropClassName,
}: Props): JSX.Element | null => {
  const { lock, unlock } = useScrollLock();
  const focusRef = useFocusTrap<HTMLElement>(open);

  useEffect(() => {
    const handleEscape = (event: KeyboardEvent) => {
      if (event.key === "Escape") {
        onClose();
      }
    };

    document.addEventListener("keydown", handleEscape);
    return () => {
      document.removeEventListener("keydown", handleEscape);
    };
  }, [onClose]);

  useEffect(() => {
    if (open) lock();
    else unlock();
  }, [open, lock, unlock]);

  return open ? (
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
  ) : null;
};

export default Modal;
