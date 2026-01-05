import React, { useEffect, useState } from "react";
import useMergeRefs from "../../hooks/useMergeRefs";
import useClickOutside from "../ClickOutside/useClickOutside";
import Floating from "../Floating";
import type { Children } from "../../types/common";

type FloatingProps = React.ComponentProps<typeof Floating>;

export type PopoverProps = Omit<
  FloatingProps,
  "visible" | "floatingContent"
> & {
  /** Whether the popover is open */
  open: boolean;
  /** Fired when the popover should close */
  onClose: () => void;
  /** Popover content */
  children: Children;
};

/** A controlled popover anchored to an element */
const Popover = ({
  anchor,
  open,
  onClose,
  children,
  vfx,
  duration,
  animateFrom,
  animateTo,
  ...floatingProps
}: PopoverProps) => {
  const [anchorEl, setAnchorEl] = useState<HTMLElement | null>(null);
  const [floatingEl, setFloatingEl] = useState<HTMLDivElement | null>(null);

  const mergedAnchorRef = useMergeRefs<HTMLElement>(
    setAnchorEl,
    anchor.props.ref
  );

  useClickOutside({
    targets: [floatingEl, anchorEl],
    eventType: "pointerdown",
    enabled: open,
    onClickOutside: onClose,
  });

  useEffect(() => {
    if (!open) return;

    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.key === "Escape") {
        onClose();
      }
    };

    document.addEventListener("keydown", handleKeyDown);

    return () => {
      document.removeEventListener("keydown", handleKeyDown);
    };
  }, [onClose, open]);

  return (
    <Floating
      {...floatingProps}
      vfx={{
        padding: "s",
        backgroundColor: "default",
        border: true,
        shadow: "floating",
        radius: "rounded",
        z: "floating",
        ...vfx,
      }}
      ref={setFloatingEl}
      anchor={React.cloneElement(anchor, { ref: mergedAnchorRef })}
      visible={open}
      floatingContent={children}
      animateFrom={animateFrom ?? { style: { opacity: 0 } }}
      animateTo={animateTo ?? { style: { opacity: 1 } }}
      duration={
        duration ?? {
          forward: 0,
          reverse: 0.25,
        }
      }
    />
  );
};

export default Popover;
