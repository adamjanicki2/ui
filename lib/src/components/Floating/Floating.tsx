import React, { useCallback, useLayoutEffect, useRef, useState } from "react";
import useMergeRefs from "../../hooks/useMergeRefs";
import type { Children, Style } from "../../types/common";
import Animated from "../Animated/Animated";

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

type SafeStyle = Omit<
  Style,
  | "top"
  | "left"
  | "right"
  | "bottom"
  | "position"
  | "transform"
  | "translate"
  | "all"
>;

type AnimatedProps = React.ComponentProps<typeof Animated>;

type Props = Omit<
  AnimatedProps,
  "children" | "visible" | "keepMounted" | "style" | "from" | "to"
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
  /** Style that can be safely applied to the floating element without distrupting positioning */
  style?: SafeStyle;
  /** Animation CSS for the start state (styles cannot override positioning) */
  from?: SafeStyle;
  /** Animation CSS for the end state (styles cannot override positioning) */
  to?: SafeStyle;
};

type Position = { top: number; left: number };
type Rect = Pick<
  DOMRect,
  "top" | "left" | "right" | "bottom" | "width" | "height"
>;

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
    duration = 0,
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

    const parent = anchorEl.offsetParent ?? anchorEl.parentElement;
    if (!parent) return;

    const parentRect = parent.getBoundingClientRect();
    const anchorRect = anchorEl.getBoundingClientRect();
    const floatingRect = floatingEl.getBoundingClientRect();

    const positionerArgs = {
      // relative to parent
      anchor: {
        top: anchorRect.top - parentRect.top,
        left: anchorRect.left - parentRect.left,
        right: anchorRect.right - parentRect.left,
        bottom: anchorRect.bottom - parentRect.top,
        width: anchorRect.width,
        height: anchorRect.height,
      },
      floating: floatingRect,
      offset,
    } as const;

    let nextPlacement = placement;
    let nextPosition = positioners[nextPlacement](positionerArgs);

    const overflowsViewport = overflowChecks[nextPlacement](
      toViewportPosition(nextPosition, parentRect),
      floatingRect
    );

    if (flip && overflowsViewport) {
      const oppositePlacement = opposites[nextPlacement];
      const oppositePosition = positioners[oppositePlacement](positionerArgs);
      if (
        !overflowChecks[oppositePlacement](
          toViewportPosition(oppositePosition, parentRect),
          floatingRect
        )
      ) {
        nextPlacement = oppositePlacement;
        nextPosition = oppositePosition;
      }
    }

    setPosition((prev) =>
      prev && prev.top === nextPosition.top && prev.left === nextPosition.left
        ? prev
        : nextPosition
    );
  }, [flip, offset, placement]);

  useLayoutEffect(() => {
    if (!visible) return;

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
        vfx={{ pos: "absolute", z: "floating", ...vfx }}
        style={{
          ...style,
          top: 0,
          left: 0,
          transform: `translate3d(${left}px, ${top}px, 0)`,
          visibility: position ? undefined : "hidden",
        }}
        visible={visible}
        duration={duration}
      >
        {floatingContent}
      </Animated>
    </>
  );
});

type Positioner = (args: {
  anchor: Rect;
  floating: Rect;
  offset: number;
}) => Position;
type Aligner = (anchor: Rect, floating: Rect) => number;

const centerX: Aligner = (anchor, floating) =>
  anchor.left + anchor.width / 2 - floating.width / 2;
const startX: Aligner = (anchor) => anchor.left;
const endX: Aligner = (anchor, floating) => anchor.right - floating.width;

const centerY: Aligner = (anchor, floating) =>
  anchor.top + anchor.height / 2 - floating.height / 2;
const startY: Aligner = (anchor) => anchor.top;
const endY: Aligner = (anchor, floating) => anchor.bottom - floating.height;

const makeTop =
  (alignX: Aligner): Positioner =>
  ({ anchor, floating, offset }) => ({
    top: anchor.top - floating.height - offset,
    left: alignX(anchor, floating),
  });

const makeBottom =
  (alignX: Aligner): Positioner =>
  ({ anchor, floating, offset }) => ({
    top: anchor.bottom + offset,
    left: alignX(anchor, floating),
  });

const makeLeft =
  (alignY: Aligner): Positioner =>
  ({ anchor, floating, offset }) => ({
    top: alignY(anchor, floating),
    left: anchor.left - floating.width - offset,
  });

const makeRight =
  (alignY: Aligner): Positioner =>
  ({ anchor, floating, offset }) => ({
    top: alignY(anchor, floating),
    left: anchor.right + offset,
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

type OverflowCheck = (position: Position, rect: Rect) => boolean;

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

const toViewportPosition = (position: Position, parent: DOMRect) => ({
  top: position.top + parent.top,
  left: position.left + parent.left,
});

export default Floating;
