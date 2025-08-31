import React from "react";
import Box, { type BoxProps } from "../Box/Box";
import Layer from "../Layer";
import Button, { IconButton } from "../Button";
import Animated from "../Animated";

type Props = BoxProps & {
  /**
   * Callback that fires when the user clicks the Ok button in the modal
   */
  onConfirm: () => void;
  /**
   * Label rendered in the ok/confirm button
   * @default "Ok"
   */
  confirmLabel?: React.ReactNode;
  /**
   * Label rendered in the cancel button
   * @default "Cancel"
   */
  cancelLabel?: React.ReactNode;
  /**
   * Whether the modal is open or not
   */
  open: boolean;
  /**
   * Callback that fires when the user closes the modal
   */
  onClose: () => void;
  /**
   * [Optional] Whether to return focus to the element that triggered the modal
   * @default false
   */
  returnFocusOnEscape?: boolean;
};

const Modal = React.forwardRef<HTMLDivElement, Props>(
  (
    {
      open,
      onClose,
      onConfirm,
      confirmLabel = "Ok",
      cancelLabel = "Cancel",
      returnFocusOnEscape,
      ...rest
    },
    ref
  ) => {
    return (
      <Animated
        className="aui-modal-backdrop"
        visible={open}
        animateTo={{ style: { opacity: 1 } }}
        animateFrom={{ style: { opacity: 0 } }}
      >
        <Layer onClose={onClose} returnFocusOnEscape={returnFocusOnEscape}>
          <Box
            role="dialog"
            aria-modal="true"
            className="aui-modal"
            fx={{ axis: "y", padding: "m", gap: "m", radius: "rounded" }}
          >
            <Box
              fx={{
                axis: "x",
                align: "center",
                justify: "end",
                width: "full",
              }}
            >
              <IconButton icon="x" onClick={onClose} />
            </Box>

            {/* children here */}
            <Box {...rest} ref={ref} />

            <Box
              fx={{
                axis: "x",
                align: "center",
                justify: "end",
                width: "full",
                gap: "m",
              }}
            >
              <Button variant="secondary" onClick={onClose}>
                {cancelLabel}
              </Button>
              <Button
                onClick={() => {
                  onConfirm();
                  onClose();
                }}
              >
                {confirmLabel}
              </Button>
            </Box>
          </Box>
        </Layer>
      </Animated>
    );
  }
);

export default Modal;
