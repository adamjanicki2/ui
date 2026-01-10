import React, { useCallback, useEffect, useRef, useState } from "react";

import { classNames } from "../../functions";
import { chevronLeft, chevronRight } from "../../icons";
import type { Children, ReadonlyableArray, Style } from "../../types/common";
import Box, { type BoxProps } from "../Box/Box";
import Button from "../Button";
import Icon from "../Icon";

type ButtonProps = {
  /** Children to render inside the button */
  children?: Children;
  /** Additional class name to apply to the button */
  className?: string;
  /** Additional styles to apply to the button */
  style?: Style;
};

type Props = Omit<BoxProps, "children"> & {
  /**
   * The interval at which autoplay runs (in seconds).
   * @example 5
   */
  autoplayInterval?: number;
  /** The child elements/slides of the carousel */
  children: ReadonlyableArray<React.ReactNode>;
  /** Props to supply to the dot buttons */
  dotProps?: Omit<ButtonProps, "children">;
  /**
   * How long the transition lasts (in seconds).
   * @default 1
   */
  duration?: number;
  /**
   * Whether to hide the arrow controls.
   * @default false
   */
  hideArrows?: boolean;
  /**
   * Whether to hide the dot controls.
   * @default false
   */
  hideDots?: boolean;
  /** Props to supply to the left arrow button */
  leftArrowProps?: ButtonProps;
  /** Props to supply to the right arrow button */
  rightArrowProps?: ButtonProps;
};

type State = {
  animating: boolean;
  cur: number;
  delta: number;
};

const DEFAULT_DURATION_S = 1;

const itemVfx = { width: "full", height: "full", stretch: "max" } as const;
const arrowVfx = {
  axis: "x",
  align: "center",
  justify: "center",
  radius: "max",
  padding: "none",
} as const;

/** A carousel for paging through a list of slides */
const Carousel = React.forwardRef<HTMLDivElement, Props>(
  (
    {
      children,
      hideArrows,
      vfx,
      hideDots,
      dotProps,
      leftArrowProps,
      rightArrowProps,
      autoplayInterval,
      duration,
      ...rest
    },
    ref
  ) => {
    // min duration
    duration = Math.max(duration ?? DEFAULT_DURATION_S, 0.1);
    autoplayInterval = autoplayInterval
      ? Math.max(duration, autoplayInterval)
      : undefined;
    const length = children.length;
    const [state, setState] = useState<State>({
      cur: 0,
      delta: 0,
      animating: false,
    });
    const intervalRef = useRef<number | null>(null);

    const { cur, delta, animating } = state;
    const next = safeMod(cur + delta, length);

    const startTransition = useCallback(
      (delta: number) => {
        if (animating || delta === 0) return;
        setState((old) => ({
          ...old,
          delta,
          animating: true,
        }));
      },
      [animating]
    );

    const onTransitionEnd = () => {
      setState(({ delta, cur }) => ({
        delta,
        animating: false,
        cur: safeMod(cur + delta, length),
      }));
    };

    useEffect(() => {
      if (autoplayInterval)
        intervalRef.current = window.setInterval(
          () => startTransition(1),
          autoplayInterval * 1000
        );

      return () => {
        const interval = intervalRef.current;
        intervalRef.current = null;
        if (interval) clearInterval(interval);
      };
    }, [autoplayInterval, startTransition]);

    if (length <= 0) return null;

    const animatingStyles = animating
      ? {
          transform: `translateX(${-(delta / Math.abs(delta)) * 100}%)`,
          transition: `transform ${duration}s ease-in-out`,
        }
      : undefined;

    return (
      <Box
        {...rest}
        vfx={{
          maxWidth: "full",
          width: "fit",
          pos: "relative",
          overflow: "hidden",
          ...vfx,
        }}
        ref={ref}
      >
        <Box
          vfx={{
            axis: delta >= 0 ? "x" : "-x",
            width: "full",
            height: "full",
          }}
          style={animatingStyles}
          onTransitionEnd={onTransitionEnd}
        >
          <Box vfx={itemVfx}>{children[cur]}</Box>
          <Box vfx={itemVfx} aria-hidden>
            {children[next]}
          </Box>
        </Box>
        {length > 1 && (
          <>
            {!hideArrows && (
              <>
                <Button
                  vfx={arrowVfx}
                  className={classNames(
                    "aui-carousel-arrow",
                    leftArrowProps?.className
                  )}
                  style={{ left: 8, ...leftArrowProps?.style }}
                  aria-label="previous"
                  onClick={() => startTransition(-1)}
                >
                  {leftArrowProps?.children ?? (
                    <Icon
                      icon={chevronLeft}
                      size="xs"
                      style={{ marginRight: 2 }}
                    />
                  )}
                </Button>
                <Button
                  vfx={arrowVfx}
                  className={classNames(
                    "aui-carousel-arrow",
                    rightArrowProps?.className
                  )}
                  style={{ right: 8, ...rightArrowProps?.style }}
                  aria-label="next"
                  onClick={() => startTransition(1)}
                >
                  {rightArrowProps?.children ?? (
                    <Icon
                      icon={chevronRight}
                      size="xs"
                      style={{ marginLeft: 2 }}
                    />
                  )}
                </Button>
              </>
            )}
            {!hideDots && (
              <Box
                vfx={{ axis: "x", align: "center", gap: "xxs" }}
                className="aui-carousel-dots"
              >
                {children.map((_, i) => (
                  <Button
                    key={i}
                    className={classNames(
                      "aui-carousel-dot",
                      dotProps?.className
                    )}
                    vfx={{ radius: "max", padding: "none" }}
                    disabled={cur === i || animating}
                    onClick={() => startTransition(i - cur)}
                    style={dotProps?.style}
                  />
                ))}
              </Box>
            )}
          </>
        )}
      </Box>
    );
  }
);

function safeMod(n: number, m: number): number {
  return ((n % m) + m) % m;
}

export default Carousel;
