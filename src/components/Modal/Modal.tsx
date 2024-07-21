import React, { useEffect } from "react";
import { useFocusTrap, useScrollLock } from "../../hooks";
import { IconButton } from "../Button";
import { classNames } from "../../utils/util";

type Props = {
  /**
   * Whether the modal is open or not
   */
  isOpen: boolean;
  /**
   * Callback that fires when the user clicks the close button or outside the modal
   */
  onClose: () => void;
  /**
   * The content of the modal
   */
  children: React.ReactNode;
  /**
   * [Optional] Additional class name
   */
  className?: string;
  /**
   * [Optional] Additional styles
   */
  style?: React.CSSProperties;
};

const Modal = ({
  isOpen,
  onClose,
  children,
  className,
  style,
}: Props): JSX.Element | null => {
  const { lock, unlock } = useScrollLock();
  const focusRef = useFocusTrap<HTMLDivElement>(isOpen);

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
    if (isOpen) {
      lock();
    } else {
      unlock();
    }
  }, [isOpen, lock, unlock]);

  if (!isOpen) return null;

  return (
    <>
      <div className="ajui-modal-backdrop" onClick={onClose} />
      <div
        className={classNames("ajui-modal", className)}
        role="dialog"
        aria-modal="true"
        ref={focusRef}
        style={style}
      >
        <div
          style={{
            display: "flex",
            justifyContent: "flex-end",
          }}
        >
          <IconButton
            name="close"
            icon="&times;"
            onClick={onClose}
            className="ajui-modal-close"
          />
        </div>
        {children}{" "}
      </div>
    </>
  );
};

export default Modal;
