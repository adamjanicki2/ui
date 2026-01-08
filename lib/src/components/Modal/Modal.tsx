import React from "react";

import { x } from "../../icons";
import Animated from "../Animated";
import Box, { type BoxProps } from "../Box/Box";
import Button, { IconButton } from "../Button";
import Layer from "../Layer";

type ButtonProps = Omit<
  React.ComponentProps<typeof Button>,
  "children" | "onClick"
>;

type Props = BoxProps & {
  /** Callback that fires when the user clicks the Ok button in the modal */
  onConfirm: () => void;
  /**
   * Label rendered in the ok/confirm button.
   * @default "Ok"
   */
  confirmLabel?: React.ReactNode;
  /**
   * Label rendered in the cancel button.
   * @default "Cancel"
   */
  cancelLabel?: React.ReactNode;
  /** Props to pass to the confirm button */
  confirmButtonProps?: ButtonProps;
  /** Props to pass to the cancel button */
  cancelButtonProps?: ButtonProps;
  /** Whether the modal is open or not */
  open: boolean;
  /** Callback that fires when the user closes the modal */
  onClose: () => void;
  /**
   * Whether to return focus to the element that triggered the modal.
   * @default false
   */
  returnFocusOnEscape?: boolean;
  /** Props to pass to the outer box container */
  wrapperBoxProps?: Omit<BoxProps, "children">;
};

/** Confirmation modal with cancel/confirm actions */
const Modal = React.forwardRef<HTMLDivElement, Props>(
  (
    {
      open,
      onClose,
      onConfirm,
      confirmButtonProps,
      cancelButtonProps,
      confirmLabel = "Ok",
      cancelLabel = "Cancel",
      returnFocusOnEscape,
      wrapperBoxProps,
      ...rest
    },
    ref
  ) => {
    const { vfx: wrapperBoxVfx, ...wrapperBoxRest } = wrapperBoxProps || {};
    return (
      <Animated
        vfx={{ z: "max" }}
        visible={open}
        to={{ opacity: 1 }}
        from={{ opacity: 0 }}
      >
        <Layer onClose={onClose} returnFocusOnEscape={returnFocusOnEscape}>
          <Box
            role="dialog"
            aria-modal="true"
            {...wrapperBoxRest}
            vfx={{
              axis: "y",
              padding: "m",
              gap: "m",
              radius: "rounded",
              maxWidth: "full",
              shadow: "floating",
              border: true,
              color: "default",
              backgroundColor: "default",
              ...wrapperBoxVfx,
            }}
          >
            <Box
              vfx={{
                axis: "x",
                align: "center",
                justify: "end",
                width: "full",
              }}
            >
              <IconButton icon={x} onClick={onClose} />
            </Box>
            <Box {...rest} ref={ref} />

            <Box
              vfx={{
                axis: "x",
                align: "center",
                justify: "end",
                width: "full",
                gap: "m",
              }}
            >
              <Button
                variant="secondary"
                {...cancelButtonProps}
                onClick={onClose}
              >
                {cancelLabel}
              </Button>
              <Button
                {...confirmButtonProps}
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
