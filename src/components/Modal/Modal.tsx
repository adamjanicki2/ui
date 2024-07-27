import React from "react";
import { IconButton } from "../Button";
import { classNames } from "../../utils/util";
import Layer from "../Layer";

type Props = {
  /**
   * Whether the modal is open or not
   */
  open: boolean;
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
  open,
  onClose,
  children,
  className,
  style,
}: Props): JSX.Element | null =>
  open ? (
    <Layer onClose={onClose}>
      <div
        className={classNames("ajui-modal", className)}
        role="dialog"
        aria-modal="true"
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
        {children}
      </div>
    </Layer>
  ) : null;

export default Modal;
