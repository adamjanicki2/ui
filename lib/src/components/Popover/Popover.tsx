import React, { useEffect, useState } from "react";
import useMergeRefs from "../../hooks/useMergeRefs";
import useClickOutside from "../../hooks/useClickOutside";
import Floating from "../Floating";

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
  children: React.ReactNode;
};

/** A controlled popover anchored to an element */
export default function Popover({
  anchor,
  open,
  onClose,
  children,
  ...floatingProps
}: PopoverProps): React.JSX.Element {
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
      ref={setFloatingEl}
      anchor={React.cloneElement(anchor, { ref: mergedAnchorRef })}
      visible={open}
      floatingContent={children}
    />
  );
}
