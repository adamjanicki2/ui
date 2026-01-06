import React, { useCallback, useLayoutEffect, useRef, useState } from "react";
import useMergeRefs from "../../hooks/useMergeRefs";
import type { Children } from "../../types/common";
import Animated from "../Animated";

export const placements = [
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

/** Position content relative to an anchor element */
const Floating = React.forwardRef<HTMLDivElement, Props>((props, ref) => {
  const {
    anchor,
    floatingContent,
    visible,
    placement = "bottom",
    offset = 0,
    flip = true,
    style,
    vfx,
    ...rest
  } = props;
  const anchorRef = useRef<HTMLElement | null>(null);
  const floatingRef = useRef<HTMLDivElement | null>(null);
  const mergedFloatingRef = useMergeRefs<HTMLDivElement>(floatingRef, ref);
  const mergedAnchorRef = useMergeRefs<HTMLElement>(
    anchorRef,
    anchor.props.ref
  );

  const [position, setPosition] = useState<Position | null>(null);

  const updatePosition = useCallback(() => {
    const anchorEl = anchorRef.current;
    const floatingEl = floatingRef.current;
    if (!anchorEl || !floatingEl) return;

    const anchorRect = anchorEl.getBoundingClientRect();
    const contentRect = floatingEl.getBoundingClientRect();
    const positionerArgs = { anchorRect, contentRect, offset } as const;

    let nextPlacement = placement;
    let nextPosition = positioners[nextPlacement](positionerArgs);
    const overflowsViewport = overflowChecks[nextPlacement](
      nextPosition,
      contentRect
    );

    if (flip && overflowsViewport) {
      const oppositePlacement = opposites[nextPlacement];
      const oppositePosition = positioners[oppositePlacement](positionerArgs);
      if (!overflowChecks[oppositePlacement](oppositePosition, contentRect)) {
        nextPlacement = oppositePlacement;
        nextPosition = oppositePosition;
      }
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
      {React.cloneElement(anchor, { ref: mergedAnchorRef })}
      <Animated
        {...rest}
        ref={mergedFloatingRef}
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
});

type Positioner = (args: {
  anchorRect: DOMRect;
  contentRect: DOMRect;
  offset: number;
}) => Position;
type Aligner = (anchorRect: DOMRect, contentRect: DOMRect) => number;

const centerX: Aligner = (anchorRect, contentRect) =>
  anchorRect.left + anchorRect.width / 2 - contentRect.width / 2;
const startX: Aligner = (anchorRect) => anchorRect.left;
const endX: Aligner = (anchorRect, contentRect) =>
  anchorRect.right - contentRect.width;

const centerY: Aligner = (anchorRect, contentRect) =>
  anchorRect.top + anchorRect.height / 2 - contentRect.height / 2;
const startY: Aligner = (anchorRect) => anchorRect.top;
const endY: Aligner = (anchorRect, contentRect) =>
  anchorRect.bottom - contentRect.height;

const makeTop =
  (alignX: Aligner): Positioner =>
  ({ anchorRect, contentRect, offset }) => ({
    top: anchorRect.top - contentRect.height - offset,
    left: alignX(anchorRect, contentRect),
  });

const makeBottom =
  (alignX: Aligner): Positioner =>
  ({ anchorRect, contentRect, offset }) => ({
    top: anchorRect.bottom + offset,
    left: alignX(anchorRect, contentRect),
  });

const makeLeft =
  (alignY: Aligner): Positioner =>
  ({ anchorRect, contentRect, offset }) => ({
    top: alignY(anchorRect, contentRect),
    left: anchorRect.left - contentRect.width - offset,
  });

const makeRight =
  (alignY: Aligner): Positioner =>
  ({ anchorRect, contentRect, offset }) => ({
    top: alignY(anchorRect, contentRect),
    left: anchorRect.right + offset,
  });

const positioners: Record<Placement, Positioner> = {
  top: makeTop(centerX),
  "top-start": makeTop(startX),
  "top-end": makeTop(endX),
  bottom: makeBottom(centerX),
  "bottom-start": makeBottom(startX),
  "bottom-end": makeBottom(endX),
  left: makeLeft(centerY),
  "left-start": makeLeft(startY),
  "left-end": makeLeft(endY),
  right: makeRight(centerY),
  "right-start": makeRight(startY),
  "right-end": makeRight(endY),
};

type OverflowCheck = (position: Position, rect: DOMRect) => boolean;

const overflowsTop: OverflowCheck = (position) => position.top < 0;
const overflowsBottom: OverflowCheck = (position, rect) =>
  position.top + rect.height > window.innerHeight;
const overflowsLeft: OverflowCheck = (position) => position.left < 0;
const overflowsRight: OverflowCheck = (position, rect) =>
  position.left + rect.width > window.innerWidth;

const overflowChecks: Record<Placement, OverflowCheck> = {
  top: overflowsTop,
  "top-start": overflowsTop,
  "top-end": overflowsTop,
  bottom: overflowsBottom,
  "bottom-start": overflowsBottom,
  "bottom-end": overflowsBottom,
  left: overflowsLeft,
  "left-start": overflowsLeft,
  "left-end": overflowsLeft,
  right: overflowsRight,
  "right-start": overflowsRight,
  "right-end": overflowsRight,
};

export default Floating;
