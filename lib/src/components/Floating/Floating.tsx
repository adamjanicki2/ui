import React, { useCallback, useLayoutEffect, useRef, useState } from "react";
import useMergeRefs from "../../hooks/useMergeRefs";
import type { Children } from "../../types/common";
import Animated from "../Animated";

const placements = [
  "top",
  "top-start",
  "top-end",
  "bottom",
  "bottom-start",
  "bottom-end",
  "left",
  "left-start",
  "left-end",
  "right",
  "right-start",
  "right-end",
] as const;

type Placement = (typeof placements)[number];

type Props = Omit<
  React.ComponentProps<typeof Animated>,
  "children" | "visible" | "keepMounted"
> & {
  /**
   * Anchor element the floating content is positioned relative to.
   * IMPORTANT: must be a single element that can hold a ref.
   */
  anchor: React.ReactElement<any>;
  /** Content rendered in the floating element */
  floatingContent: Children;
  /** Controls the visibility of the floating content */
  visible: boolean;
  /**
   * Position the floating element around the anchor.
   * @default "bottom"
   */
  placement?: Placement;
  /**
   * Pixel offset between anchor and floating element.
   * @default 0
   */
  offset?: number;
  /**
   * Whether to flip to the opposite placement when overflowing viewport.
   * @default true
   */
  flip?: boolean;
};

type Position = { top: number; left: number };

const opposites: Record<Placement, Placement> = {
  top: "bottom",
  "top-start": "bottom-start",
  "top-end": "bottom-end",
  bottom: "top",
  "bottom-start": "top-start",
  "bottom-end": "top-end",
  left: "right",
  "left-start": "right-start",
  "left-end": "right-end",
  right: "left",
  "right-start": "left-start",
  "right-end": "left-end",
};

const centerX = (anchorRect: DOMRect, contentRect: DOMRect) =>
  anchorRect.left + anchorRect.width / 2 - contentRect.width / 2;
const startX = (anchorRect: DOMRect) => anchorRect.left;
const endX = (anchorRect: DOMRect, contentRect: DOMRect) =>
  anchorRect.right - contentRect.width;

const centerY = (anchorRect: DOMRect, contentRect: DOMRect) =>
  anchorRect.top + anchorRect.height / 2 - contentRect.height / 2;
const startY = (anchorRect: DOMRect) => anchorRect.top;
const endY = (anchorRect: DOMRect, contentRect: DOMRect) =>
  anchorRect.bottom - contentRect.height;

type Positioner = (args: {
  anchorRect: DOMRect;
  contentRect: DOMRect;
  offset: number;
}) => Position;

const positioners: Record<Placement, Positioner> = {
  top: ({ anchorRect, contentRect, offset }) => ({
    top: anchorRect.top - contentRect.height - offset,
    left: centerX(anchorRect, contentRect),
  }),
  "top-start": ({ anchorRect, contentRect, offset }) => ({
    top: anchorRect.top - contentRect.height - offset,
    left: startX(anchorRect),
  }),
  "top-end": ({ anchorRect, contentRect, offset }) => ({
    top: anchorRect.top - contentRect.height - offset,
    left: endX(anchorRect, contentRect),
  }),

  bottom: ({ anchorRect, contentRect, offset }) => ({
    top: anchorRect.bottom + offset,
    left: centerX(anchorRect, contentRect),
  }),
  "bottom-start": ({ anchorRect, offset }) => ({
    top: anchorRect.bottom + offset,
    left: startX(anchorRect),
  }),
  "bottom-end": ({ anchorRect, contentRect, offset }) => ({
    top: anchorRect.bottom + offset,
    left: endX(anchorRect, contentRect),
  }),

  left: ({ anchorRect, contentRect, offset }) => ({
    top: centerY(anchorRect, contentRect),
    left: anchorRect.left - contentRect.width - offset,
  }),
  "left-start": ({ anchorRect, contentRect, offset }) => ({
    top: startY(anchorRect),
    left: anchorRect.left - contentRect.width - offset,
  }),
  "left-end": ({ anchorRect, contentRect, offset }) => ({
    top: endY(anchorRect, contentRect),
    left: anchorRect.left - contentRect.width - offset,
  }),

  right: ({ anchorRect, contentRect, offset }) => ({
    top: centerY(anchorRect, contentRect),
    left: anchorRect.right + offset,
  }),
  "right-start": ({ anchorRect, offset }) => ({
    top: startY(anchorRect),
    left: anchorRect.right + offset,
  }),
  "right-end": ({ anchorRect, contentRect, offset }) => ({
    top: endY(anchorRect, contentRect),
    left: anchorRect.right + offset,
  }),
};

const overflowChecks: Record<
  Placement,
  (position: Position, rect: DOMRect) => boolean
> = {
  top: (position) => position.top < 0,
  "top-start": (position) => position.top < 0,
  "top-end": (position) => position.top < 0,
  bottom: (position, rect) => position.top + rect.height > window.innerHeight,
  "bottom-start": (position, rect) =>
    position.top + rect.height > window.innerHeight,
  "bottom-end": (position, rect) =>
    position.top + rect.height > window.innerHeight,
  left: (position) => position.left < 0,
  "left-start": (position) => position.left < 0,
  "left-end": (position) => position.left < 0,
  right: (position, rect) => position.left + rect.width > window.innerWidth,
  "right-start": (position, rect) =>
    position.left + rect.width > window.innerWidth,
  "right-end": (position, rect) =>
    position.left + rect.width > window.innerWidth,
};

/** Position content relative to an anchor element */
const Floating = ({
  anchor,
  floatingContent,
  visible,
  placement = "bottom",
  offset = 0,
  flip = true,
  style,
  vfx,
  ...rest
}: Props): React.JSX.Element => {
  const anchorRef = useRef<HTMLElement | null>(null);
  const floatingRef = useRef<HTMLDivElement | null>(null);

  const [position, setPosition] = useState<Position | null>(null);

  const mergedAnchorRef = useMergeRefs<HTMLElement>(
    anchorRef,
    anchor.props.ref
  );

  const updatePosition = useCallback(() => {
    const anchorEl = anchorRef.current;
    const floatingEl = floatingRef.current;
    if (!anchorEl || !floatingEl) return;

    const anchorRect = anchorEl.getBoundingClientRect();
    const contentRect = floatingEl.getBoundingClientRect();

    let nextPlacement = placement;
    let nextPosition = positioners[nextPlacement]({
      anchorRect,
      contentRect,
      offset,
    });
    const overflowsViewport = overflowChecks[nextPlacement](
      nextPosition,
      contentRect
    );

    if (flip && overflowsViewport) {
      nextPlacement = opposites[nextPlacement];
      nextPosition = positioners[nextPlacement]({
        anchorRect,
        contentRect,
        offset,
      });
    }

    setPosition((prev) => {
      if (
        prev &&
        prev.top === nextPosition.top &&
        prev.left === nextPosition.left
      ) {
        return prev;
      }
      return nextPosition;
    });
  }, [flip, offset, placement]);

  useLayoutEffect(() => {
    if (!visible) return;

    setPosition(null);
    updatePosition();

    window.addEventListener("resize", updatePosition);
    document.addEventListener("scroll", updatePosition, true);

    const anchorEl = anchorRef.current;
    const floatingEl = floatingRef.current;
    let resizeObserver: ResizeObserver | null = null;

    if (anchorEl && floatingEl) {
      resizeObserver = new ResizeObserver(updatePosition);
      resizeObserver.observe(anchorEl);
      resizeObserver.observe(floatingEl);
    }

    return () => {
      window.removeEventListener("resize", updatePosition);
      document.removeEventListener("scroll", updatePosition, true);
      resizeObserver?.disconnect();
    };
  }, [updatePosition, visible]);

  const { top = 0, left = 0 } = position ?? {};

  return (
    <>
      {React.cloneElement(anchor, {
        ref: mergedAnchorRef,
      })}
      <Animated
        {...rest}
        ref={floatingRef}
        vfx={{ pos: "fixed", z: "floating", ...vfx }}
        style={{
          ...style,
          top,
          left,
          visibility: position ? "visible" : "hidden",
        }}
        visible={visible}
      >
        {floatingContent}
      </Animated>
    </>
  );
};

export default Floating;
