import React, { useCallback, useLayoutEffect, useRef, useState } from "react";
import useMergeRefs from "../../hooks/useMergeRefs";
import type { Children } from "../../types/common";
import Animated from "../Animated";

type Placement =
  | "top"
  | "top-start"
  | "top-end"
  | "bottom"
  | "bottom-start"
  | "bottom-end"
  | "left"
  | "left-start"
  | "left-end"
  | "right"
  | "right-start"
  | "right-end";

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

type Pos = { top: number; left: number };
type Viewport = {
  width: number;
  height: number;
  offsetTop: number;
  offsetLeft: number;
};

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

  const [position, setPosition] = useState<Pos | null>(null);

  const updatePosition = useCallback(() => {
    const anchorEl = anchorRef.current;
    const floatingEl = floatingRef.current;
    if (!anchorEl || !floatingEl) return;

    const visViewPort = window.visualViewport;
    const viewport: Viewport = {
      width: visViewPort?.width ?? window.innerWidth,
      height: visViewPort?.height ?? window.innerHeight,
      offsetTop: visViewPort?.offsetTop ?? 0,
      offsetLeft: visViewPort?.offsetLeft ?? 0,
    };
    const anchorRect = anchorEl.getBoundingClientRect();
    const floatingRect = floatingEl.getBoundingClientRect();
    const positionerArgs = { anchorRect, floatingRect, offset } as const;

    let nextPlacement = placement;
    let nextPosition = positioners[nextPlacement](positionerArgs);
    const overflowsViewport = overflowChecks[nextPlacement]({
      pos: nextPosition,
      rect: floatingRect,
      viewport,
    });

    if (flip && overflowsViewport) {
      const oppositePlacement = opposites[nextPlacement];
      const oppositePosition = positioners[oppositePlacement](positionerArgs);
      if (
        !overflowChecks[oppositePlacement]({
          pos: oppositePosition,
          rect: floatingRect,
          viewport,
        })
      ) {
        nextPlacement = oppositePlacement;
        nextPosition = oppositePosition;
      }
    }

    nextPosition = {
      top: nextPosition.top + viewport.offsetTop,
      left: nextPosition.left + viewport.offsetLeft,
    };

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

    document.addEventListener("scroll", updatePosition, true);
    const viewport = window.visualViewport;
    if (viewport) {
      viewport.addEventListener("resize", updatePosition);
      viewport.addEventListener("scroll", updatePosition);
    } else {
      window.addEventListener("resize", updatePosition);
    }

    const anchorEl = anchorRef.current;
    const floatingEl = floatingRef.current;
    let resizeObserver: ResizeObserver | null = null;

    if (anchorEl && floatingEl) {
      resizeObserver = new ResizeObserver(updatePosition);
      resizeObserver.observe(anchorEl);
      resizeObserver.observe(floatingEl);
    }

    return () => {
      document.removeEventListener("scroll", updatePosition, true);
      if (viewport) {
        viewport.removeEventListener("resize", updatePosition);
        viewport.removeEventListener("scroll", updatePosition);
      } else {
        window.removeEventListener("resize", updatePosition);
      }
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
  floatingRect: DOMRect;
  offset: number;
}) => Pos;
type Aligner = (anchorRect: DOMRect, floatingRect: DOMRect) => number;

const centerX: Aligner = (anchorRect, floatingRect) =>
  anchorRect.left + anchorRect.width / 2 - floatingRect.width / 2;
const startX: Aligner = (anchorRect) => anchorRect.left;
const endX: Aligner = (anchorRect, floatingRect) =>
  anchorRect.right - floatingRect.width;

const centerY: Aligner = (anchorRect, floatingRect) =>
  anchorRect.top + anchorRect.height / 2 - floatingRect.height / 2;
const startY: Aligner = (anchorRect) => anchorRect.top;
const endY: Aligner = (anchorRect, floatingRect) =>
  anchorRect.bottom - floatingRect.height;

const makeTop =
  (alignX: Aligner): Positioner =>
  ({ anchorRect, floatingRect, offset }) => ({
    top: anchorRect.top - floatingRect.height - offset,
    left: alignX(anchorRect, floatingRect),
  });

const makeBottom =
  (alignX: Aligner): Positioner =>
  ({ anchorRect, floatingRect, offset }) => ({
    top: anchorRect.bottom + offset,
    left: alignX(anchorRect, floatingRect),
  });

const makeLeft =
  (alignY: Aligner): Positioner =>
  ({ anchorRect, floatingRect, offset }) => ({
    top: alignY(anchorRect, floatingRect),
    left: anchorRect.left - floatingRect.width - offset,
  });

const makeRight =
  (alignY: Aligner): Positioner =>
  ({ anchorRect, floatingRect, offset }) => ({
    top: alignY(anchorRect, floatingRect),
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

type OverflowCheck = (args: {
  pos: Pos;
  rect: DOMRect;
  viewport: Viewport;
}) => boolean;

const overflowsTop: OverflowCheck = ({ pos, viewport }) =>
  pos.top < viewport.offsetTop;
const overflowsBottom: OverflowCheck = ({ pos, rect, viewport }) =>
  pos.top + rect.height > viewport.offsetTop + viewport.height;
const overflowsLeft: OverflowCheck = ({ pos, viewport }) =>
  pos.left < viewport.offsetLeft;
const overflowsRight: OverflowCheck = ({ pos, rect, viewport }) =>
  pos.left + rect.width > viewport.offsetLeft + viewport.width;

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
