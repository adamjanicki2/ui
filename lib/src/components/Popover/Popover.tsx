import React, { useEffect, useRef, useState } from "react";
import { BoxProps } from "../Box/Box";
import Animated from "../Animated";
import ClickOutside from "../ClickOutside";
import type { Style } from "../../utils/types";
import { classNames } from "../../functions";
import useMergeRefs from "../../hooks/useMergeRefs";

type Placement = "bottom" | "top" | "left" | "right";
type TriggerRef = React.RefObject<HTMLElement | null>;

type Props = BoxProps & {
  /**
   * The trigger ref for the element to position the popover over.
   */
  triggerRef: TriggerRef;
  /**
   * Whether the popover is open.
   */
  open: boolean;
  /**
   * The placement of the popover relative to the trigger element.
   * @default "bottom"
   */
  placement?: Placement;
  /**
   * The offset of the popover relative to the trigger element.
   * @default 0
   */
  offset?: number;
  /**
   * Callback function to execute when the popover is closed.
   */
  onClose?: () => void;
  /**
   * Whether to return focus to the trigger element when the popover is closed
   * by pressing the escape key.
   * @default false
   */
  returnFocusOnEscape?: boolean;
};

export const UnstyledPopover = React.forwardRef<HTMLDivElement, Props>(
  (
    {
      triggerRef,
      open,
      returnFocusOnEscape,
      onClose,
      offset = 0,
      placement = "bottom",
      style,
      ...rest
    },
    ref
  ) => {
    const popoverRef = useRef<HTMLDivElement>(null);
    useEffect(() => {
      if (open && onClose) {
        const listener = (e: KeyboardEvent) => {
          if (e.key === "Escape") {
            onClose();
            if (!returnFocusOnEscape) {
              const activeEl = document.activeElement as HTMLElement | null;
              activeEl?.blur();
            }
          }
        };
        document.addEventListener("keydown", listener);
        return () => {
          document.removeEventListener("keydown", listener);
        };
      }
    }, [open, onClose, returnFocusOnEscape]);

    const [position, setPosition] = useState({ x: 0, y: 0 });

    useEffect(() => {
      if (!open || !triggerRef.current || !popoverRef.current) return;

      const triggerRect = triggerRef.current.getBoundingClientRect();
      const popoverRect = popoverRef.current.getBoundingClientRect();

      let x = 0;
      let y = 0;

      switch (placement) {
        case "top":
          x = triggerRect.left + triggerRect.width / 2 - popoverRect.width / 2;
          y = triggerRect.top - popoverRect.height - offset;
          break;
        case "bottom":
          x = triggerRect.left + triggerRect.width / 2 - popoverRect.width / 2;
          y = triggerRect.bottom + offset;
          break;
        case "left":
          x = triggerRect.left - popoverRect.width - offset;
          y = triggerRect.top + triggerRect.height / 2 - popoverRect.height / 2;
          break;
        case "right":
          x = triggerRect.right + offset;
          y = triggerRect.top + triggerRect.height / 2 - popoverRect.height / 2;
          break;
      }

      setPosition({ x, y });
    }, [open, placement, offset, triggerRef]);

    const mergedRef = useMergeRefs(ref, popoverRef);

    return (
      <ClickOutside
        onClickOutside={() => onClose?.()}
        mouseEvent="mousedown"
        ignoreElements={[triggerRef.current]}
      >
        <Animated
          style={{
            ...style,
            ...computeFloatingStyle(triggerRef, placement, offset),
          }}
          duration={{ forward: 0, reverse: 0.25 }}
          transitionProperties={["opacity"]}
          animateFrom={{ style: { opacity: 0 } }}
          animateTo={{ style: { opacity: 1 } }}
          visible={open}
          {...rest}
          ref={mergedRef}
        />
      </ClickOutside>
    );
  }
);

function computeFloatingStyle(
  triggerRef: TriggerRef,
  placement: Placement,
  offset: number = 0
): Style {
  const trigger = triggerRef.current;
  if (!trigger) return {};
  const parent = trigger.offsetParent as HTMLElement | null;
  const parentRect = parent?.getBoundingClientRect() ?? { top: 0, left: 0 };
  const rect = trigger.getBoundingClientRect();
  const style: Style = { position: "absolute" };
  switch (placement) {
    case "bottom":
      style.top = rect.bottom - parentRect.top + offset;
      style.left = rect.left - parentRect.left + rect.width / 2;
      style.transform = "translateX(-50%)";
      break;
    case "top":
      style.top = rect.top - parentRect.top - offset;
      style.left = rect.left - parentRect.left + rect.width / 2;
      style.transform = "translate(-50%, -100%)";
      break;
    case "left":
      style.top = rect.top - parentRect.top + rect.height / 2;
      style.left = rect.left - parentRect.left - offset;
      style.transform = "translate(-100%, -50%)";
      break;
    case "right":
      style.top = rect.top - parentRect.top + rect.height / 2;
      style.left = rect.right - parentRect.left + offset;
      style.transform = "translateY(-50%)";
      break;
  }
  return style;
}

const Popover = React.forwardRef<HTMLDivElement, Props>(
  ({ className, layout, ...rest }, ref) => (
    <UnstyledPopover
      {...rest}
      className={classNames("aui-popover", className)}
      layout={{ padding: "s", ...layout }}
      ref={ref}
    />
  )
);
export default Popover;
