import React, { useEffect, useRef } from "react";

import useMergeRefs from "../../hooks/useMergeRefs";
import type { Children } from "../../types/common";
import { DEFAULT_ANIMATION_DURATION_S } from "../Animated/Animated";
import useClickOutside from "../ClickOutside/useClickOutside";
import Floating from "../Floating";

type FloatingProps = React.ComponentProps<typeof Floating>;

export type PopoverProps = Omit<FloatingProps, "floating" | "visible"> & {
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
  from,
  to,
  ...floatingProps
}: PopoverProps) => {
  const anchorRef = useRef<HTMLElement | null>(null);
  const floatingRef = useRef<HTMLDivElement | null>(null);
  const onCloseRef = useRef(onClose);
  const openRef = useRef(open);

  onCloseRef.current = onClose;
  openRef.current = open;

  const mergedAnchorRef = useMergeRefs<HTMLElement>(
    anchorRef,
    anchor.props.ref
  );

  useClickOutside({
    targets: [floatingRef, anchorRef],
    eventType: "mousedown",
    enabled: open,
    onClickOutside: onClose,
  });

  useEffect(() => {
    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.key === "Escape" && openRef.current) onCloseRef.current();
    };

    document.addEventListener("keydown", handleKeyDown);
    return () => document.removeEventListener("keydown", handleKeyDown);
  }, []);

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
      ref={floatingRef}
      anchor={React.cloneElement(anchor, { ref: mergedAnchorRef })}
      visible={open}
      floating={children}
      from={from ?? { opacity: 0 }}
      to={to ?? { opacity: 1 }}
      duration={
        duration ?? {
          forward: 0,
          reverse: DEFAULT_ANIMATION_DURATION_S,
        }
      }
    />
  );
};

export default Popover;
