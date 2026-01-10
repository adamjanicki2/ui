import React, { useCallback, useEffect, useRef, useState } from "react";

import useMergeRefs from "../../hooks/useMergeRefs";
import type { Children } from "../../types/common";
import { DEFAULT_ANIMATION_DURATION_S } from "../Animated/Animated";
import Floating from "../Floating/Floating";

type FloatingProps = React.ComponentProps<typeof Floating>;

export type TooltipProps = Omit<
  FloatingProps,
  "anchor" | "floatingContent" | "onPointerEnter" | "onPointerLeave" | "visible"
> & {
  /**
   * The element to attach the tooltip to.
   * IMPORTANT: This must be able to hold a ref.
   */
  children: React.ReactElement<any>;
  /**
   * Whether the tooltip is disabled. If true, will not show the tooltip.
   * @default false
   */
  disabled?: boolean;
  /** Children to render inside the tooltip container */
  tooltipContent: Children;
};

type Side = "bottom" | "left" | "right" | "top";
type Point = { x: number; y: number };

// ordered (clockwise or counter clockwise) set of vertices of a trapezoid
type Zoid = readonly [Point, Point, Point, Point];

const withinRect = (point: Point, rect: DOMRect) =>
  point.x >= rect.left &&
  point.x <= rect.right &&
  point.y >= rect.top &&
  point.y <= rect.bottom;

// point in poly/raycasting algorithm
const pip = (point: Point, zoid: Zoid) => {
  const { x, y } = point;
  let inside = false;
  // only look at vertex pairs which are the true edges
  for (let i = 0, j = zoid.length - 1; i < zoid.length; j = i++) {
    const { x: xi, y: yi } = zoid[i];
    const { x: xj, y: yj } = zoid[j];

    const intersects =
      yi > y !== yj > y && x < ((xj - xi) * (y - yi)) / (yj - yi) + xi;
    if (intersects) inside = !inside;
  }
  return inside;
};

/** Which side the tooltip is relative to the anchor. */
const inferSide = (anchorRect: DOMRect, floatingRect: DOMRect): Side => {
  if (floatingRect.top >= anchorRect.bottom) return "bottom";
  if (floatingRect.bottom <= anchorRect.top) return "top";
  if (floatingRect.left >= anchorRect.right) return "right";
  return "left";
};

// bridge the gap between anchor and floating as a safe area
const zoids: Record<
  Side,
  (fromRect: DOMRect, toRect: DOMRect, padding: number) => Zoid
> = {
  bottom: (fromRect, toRect, padding) => [
    { x: fromRect.left - padding, y: fromRect.bottom - padding },
    { x: fromRect.right + padding, y: fromRect.bottom - padding },
    { x: toRect.right + padding, y: toRect.top + padding },
    { x: toRect.left - padding, y: toRect.top + padding },
  ],
  top: (fromRect, toRect, padding) => [
    { x: fromRect.left - padding, y: fromRect.top + padding },
    { x: fromRect.right + padding, y: fromRect.top + padding },
    { x: toRect.right + padding, y: toRect.bottom - padding },
    { x: toRect.left - padding, y: toRect.bottom - padding },
  ],
  right: (fromRect, toRect, padding) => [
    { x: fromRect.right - padding, y: fromRect.top - padding },
    { x: fromRect.right - padding, y: fromRect.bottom + padding },
    { x: toRect.left + padding, y: toRect.bottom + padding },
    { x: toRect.left + padding, y: toRect.top - padding },
  ],
  left: (fromRect, toRect, padding) => [
    { x: fromRect.left + padding, y: fromRect.top - padding },
    { x: fromRect.left + padding, y: fromRect.bottom + padding },
    { x: toRect.right - padding, y: toRect.bottom + padding },
    { x: toRect.right - padding, y: toRect.top - padding },
  ],
};

// a hover safe zone between anchor and floating elements
const makeZoid = (
  side: Side,
  fromRect: DOMRect,
  toRect: DOMRect,
  // bit of jitter
  padding = 4
): Zoid => zoids[side](fromRect, toRect, padding);

const Tooltip = ({
  tooltipContent,
  children,
  disabled = false,
  vfx,
  from,
  to,
  flip = true,
  ...floatingProps
}: TooltipProps) => {
  const [open, setOpen] = useState(false);
  const anchorRef = useRef<HTMLElement | null>(null);
  const floatingRef = useRef<HTMLDivElement | null>(null);
  const stopTrackingRef = useRef<(() => void) | null>(null);

  const stopTracking = useCallback(() => {
    stopTrackingRef.current?.();
    stopTrackingRef.current = null;
  }, []);

  useEffect(() => {
    if (disabled) {
      stopTracking();
      setOpen(false);
    }
    return stopTracking;
  }, [disabled, stopTracking]);

  const startTracking = () => {
    stopTracking();

    const anchorEl = anchorRef.current;
    const floatingEl = floatingRef.current;
    if (!anchorEl || !floatingEl) {
      setOpen(false);
      return;
    }

    const anchorRect = anchorEl.getBoundingClientRect();
    const floatingRect = floatingEl.getBoundingClientRect();
    const side = inferSide(anchorRect, floatingRect);
    const safeZoid = makeZoid(side, anchorRect, floatingRect);

    const onMove = (e: PointerEvent) => {
      const pointerType = e.pointerType;
      if (pointerType !== "mouse") return;
      const point = { x: e.clientX, y: e.clientY };

      const anchorEl = anchorRef.current;
      const floatingEl = floatingRef.current;
      if (!anchorEl || !floatingEl) return;

      const anchorRect = anchorEl.getBoundingClientRect();
      const floatingRect = floatingEl.getBoundingClientRect();

      if (
        withinRect(point, anchorRect) ||
        withinRect(point, floatingRect) ||
        pip(point, safeZoid)
      )
        return;

      setOpen(false);
      stopTracking();
    };

    window.addEventListener("pointermove", onMove);

    stopTrackingRef.current = () => {
      window.removeEventListener("pointermove", onMove);
    };
  };

  const mergedAnchorRef = useMergeRefs<HTMLElement>(
    anchorRef,
    children.props.ref
  );

  if (disabled) return children;

  const anchor = React.cloneElement(children, {
    onPointerEnter: (e: React.PointerEvent) => {
      children.props?.onPointerEnter?.(e);
      if (e.pointerType === "mouse") {
        stopTracking();
        setOpen(true);
      }
    },
    onPointerLeave: (e: React.PointerEvent) => {
      children.props?.onPointerLeave?.(e);
      if (e.pointerType === "mouse") startTracking();
    },
    ref: mergedAnchorRef,
  });

  return (
    <Floating
      {...floatingProps}
      flip={flip}
      ref={floatingRef}
      role="tooltip"
      anchor={anchor}
      visible={open}
      duration={DEFAULT_ANIMATION_DURATION_S}
      from={from ?? { opacity: 0 }}
      to={to ?? { opacity: 1 }}
      onPointerEnter={(e: React.PointerEvent) => {
        if (e.pointerType === "mouse") {
          stopTracking();
          setOpen(true);
        }
      }}
      onPointerLeave={(e: React.PointerEvent) => {
        if (e.pointerType === "mouse") startTracking();
      }}
      vfx={{
        padding: "s",
        backgroundColor: "default",
        border: true,
        shadow: "floating",
        radius: "rounded",
        z: "floating",
        ...vfx,
      }}
      floatingContent={tooltipContent}
    />
  );
};

export default Tooltip;
