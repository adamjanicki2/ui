import React from "react";
import Box, { type BoxProps } from "../Box/Box";
import Layer from "../Layer";
import { classNames } from "../../functions";
import Button, { IconButton } from "../Button";

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
      onClose,
      onConfirm,
      confirmLabel = "Ok",
      cancelLabel = "Cancel",
      className,
      returnFocusOnEscape,
      layout,
      children,
      ...rest
    },
    ref
  ) => {
    return (
      <Layer onClose={onClose} returnFocusOnEscape={returnFocusOnEscape}>
        <Box
          role="dialog"
          aria-modal="true"
          className={classNames("aui-modal aui-corners--rounded", className)}
          layout={{ axis: "y", padding: "m", gap: "m", ...layout }}
          {...rest}
          ref={ref}
        >
          <Box
            layout={{
              axis: "x",
              align: "center",
              justify: "end",
              width: "full",
            }}
          >
            <IconButton icon="x" onClick={onClose} />
          </Box>
          {/* children here */}
          {children}
          <Box
            layout={{
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
    );
  }
);

export default Modal;
