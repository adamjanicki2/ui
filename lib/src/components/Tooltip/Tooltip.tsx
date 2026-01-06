import React, { useCallback, useEffect, useRef, useState } from "react";
import type { Children } from "../../types/common";
import useMergeRefs from "../../hooks/useMergeRefs";
import Floating from "../Floating/Floating";

type FloatingProps = React.ComponentProps<typeof Floating>;

export type TooltipProps = Omit<
  FloatingProps,
  "onMouseEnter" | "onMouseLeave" | "visible" | "floatingContent" | "anchor"
> & {
  /** Children to render inside the tooltip container */
  tooltipContent: Children;
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
};

type Side = "top" | "bottom" | "left" | "right";
type Point = { x: number; y: number };
type Quadrilateral = readonly [Point, Point, Point, Point];

const withinRect = (point: Point, rect: DOMRect) =>
  point.x >= rect.left &&
  point.x <= rect.right &&
  point.y >= rect.top &&
  point.y <= rect.bottom;

const withinQuadrilateral = (point: Point, quad: Quadrilateral) => {
  let inside = false;
  for (let i = 0, j = 3; i < 4; j = i++) {
    const { x: xi, y: yi } = quad[i];
    const { x: xj, y: yj } = quad[j];

    const intersects =
      yi > point.y !== yj > point.y &&
      point.x < ((xj - xi) * (point.y - yi)) / (yj - yi) + xi;
    if (intersects) inside = !inside;
  }
  return inside;
};

const inferSide = (anchorRect: DOMRect, floatingRect: DOMRect): Side => {
  if (floatingRect.top >= anchorRect.bottom) return "bottom";
  if (floatingRect.bottom <= anchorRect.top) return "top";
  if (floatingRect.left >= anchorRect.right) return "right";
  return "left";
};

const quadBuilders: Record<
  Side,
  (fromRect: DOMRect, toRect: DOMRect, padding: number) => Quadrilateral
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

const makeQuadrilateral = (
  side: Side,
  fromRect: DOMRect,
  toRect: DOMRect,
  padding: number
): Quadrilateral => quadBuilders[side](fromRect, toRect, padding);

const Tooltip = ({
  tooltipContent,
  children,
  disabled = false,
  vfx,
  offset = 0,
  duration = 0,
  animateFrom,
  animateTo,
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

  useEffect(() => stopTracking, [stopTracking]);

  const startTracking = (from: "anchor" | "floating") => {
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
    const quad =
      from === "anchor"
        ? makeQuadrilateral(side, anchorRect, floatingRect, offset)
        : makeQuadrilateral(side, floatingRect, anchorRect, offset);

    const onMove = (e: PointerEvent) => {
      const point = { x: e.clientX, y: e.clientY };

      const anchorEl = anchorRef.current;
      const floatingEl = floatingRef.current;
      if (!anchorEl || !floatingEl) return;

      const anchorRect = anchorEl.getBoundingClientRect();
      const floatingRect = floatingEl.getBoundingClientRect();

      if (
        withinRect(point, anchorRect) ||
        withinRect(point, floatingRect) ||
        withinQuadrilateral(point, quad)
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
    onMouseEnter: (e: React.MouseEvent) => {
      children.props?.onMouseEnter?.(e);
      stopTracking();
      setOpen(true);
    },
    onMouseLeave: (e: React.MouseEvent) => {
      children.props?.onMouseLeave?.(e);
      startTracking("anchor");
    },
    ref: mergedAnchorRef,
  });

  return (
    <Floating
      {...floatingProps}
      ref={floatingRef}
      role="tooltip"
      anchor={anchor}
      visible={open}
      duration={duration}
      animateFrom={animateFrom ?? { style: { opacity: 0 } }}
      animateTo={animateTo ?? { style: { opacity: 1 } }}
      onMouseEnter={() => {
        stopTracking();
        setOpen(true);
      }}
      onMouseLeave={() => startTracking("floating")}
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
