import React, { useCallback, useLayoutEffect, useRef, useState } from "react";
import useMergeRefs from "../../hooks/useMergeRefs";
import type { Children } from "../../types/common";
import Animated from "../Animated";

type Placement = "top" | "bottom" | "left" | "right";

type AnimatedProps = React.ComponentProps<typeof Animated>;

type Props = Omit<AnimatedProps, "children" | "visible" | "keepMounted"> & {
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
    let nextPosition = positioners[nextPlacement](
      anchorRect,
      contentRect,
      offset
    );
    const overflowsViewport = overflowChecks[nextPlacement](
      nextPosition,
      contentRect
    );

    if (flip && overflowsViewport) {
      nextPlacement = opposites[nextPlacement];
      nextPosition = positioners[nextPlacement](
        anchorRect,
        contentRect,
        offset
      );
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

  useLayoutEffect(updatePosition, [updatePosition]);

  useLayoutEffect(() => {
    window.addEventListener("resize", updatePosition);
    document.addEventListener("scroll", updatePosition, true);

    return () => {
      window.removeEventListener("resize", updatePosition);
      document.removeEventListener("scroll", updatePosition, true);
    };
  }, [updatePosition]);

  useLayoutEffect(() => {
    const anchorEl = anchorRef.current;
    const floatingEl = floatingRef.current;
    if (!anchorEl || !floatingEl) return;

    const resizeObserver = new ResizeObserver(updatePosition);
    resizeObserver.observe(anchorEl);
    resizeObserver.observe(floatingEl);

    return () => resizeObserver.disconnect();
  }, [updatePosition]);

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
          top: position?.top,
          left: position?.left,
          visibility: position ? "visible" : "hidden",
        }}
        keepMounted
        visible={Boolean(position) && visible}
        aria-hidden={Boolean(position)}
      >
        {floatingContent}
      </Animated>
    </>
  );
};

const opposites: Record<Placement, Placement> = {
  top: "bottom",
  bottom: "top",
  left: "right",
  right: "left",
};

const positioners: Record<
  Placement,
  (anchorRect: DOMRect, contentRect: DOMRect, offset: number) => Position
> = {
  bottom: (anchorRect, contentRect, offset) => ({
    top: anchorRect.bottom + offset,
    left: anchorRect.left + anchorRect.width / 2 - contentRect.width / 2,
  }),
  top: (anchorRect, contentRect, offset) => ({
    top: anchorRect.top - contentRect.height - offset,
    left: anchorRect.left + anchorRect.width / 2 - contentRect.width / 2,
  }),
  right: (anchorRect, contentRect, offset) => ({
    top: anchorRect.top + anchorRect.height / 2 - contentRect.height / 2,
    left: anchorRect.right + offset,
  }),
  left: (anchorRect, contentRect, offset) => ({
    top: anchorRect.top + anchorRect.height / 2 - contentRect.height / 2,
    left: anchorRect.left - contentRect.width - offset,
  }),
};

const overflowChecks: Record<
  Placement,
  (position: Position, rect: DOMRect) => boolean
> = {
  bottom: (position, rect) => position.top + rect.height > window.innerHeight,
  top: (position) => position.top < 0,
  right: (position, rect) => position.left + rect.width > window.innerWidth,
  left: (position) => position.left < 0,
};

export default Floating;
