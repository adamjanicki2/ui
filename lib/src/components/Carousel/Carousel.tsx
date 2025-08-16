import React, { useState, useEffect, useRef, useCallback } from "react";
import { classNames } from "../../functions";
import Button from "../Button";
import type { Style } from "../../utils/types";
import Box, { type BoxProps } from "../Box/Box";

type ButtonProps = {
  /**
   * Children to render inside the button
   */
  children?: React.ReactNode | React.ReactNode[];
  /**
   * Additional class name to apply to the button
   */
  className?: string;
  /**
   * Additional styles to apply to the button
   */
  style?: Style;
};

type Props = BoxProps & {
  /**
   * The child elements/slides of the carousel
   */
  children: React.ReactNode[];
  /**
   * How long the transition lasts (in seconds)
   * @default 1
   */
  duration?: number;
  /**
   * The interval at which autoplay runs (in seconds)
   * @default false
   */
  autoplayInterval?: number;
  /**
   * Whether to hide the arrow controls
   * @default false
   */
  hideArrows?: boolean;
  /**
   * Whether to hide the dot controls
   * @default false
   */
  hideDots?: boolean;
  /**
   * [Optional] props to supply to the dot buttons
   */
  dotProps?: Omit<ButtonProps, "children">;
  /**
   * [Optional] props to supply to the left arrow button
   */
  leftArrowProps?: ButtonProps;
  /**
   * [Optional] props to supply to the right arrow button
   */
  rightArrowProps?: ButtonProps;
};

type State = {
  cur: number;
  delta: number;
  animating: boolean;
};

const DEFAULT_DURATION_S = 1;

const Carousel = React.forwardRef<HTMLDivElement, Props>((props, ref) => {
  const {
    children,
    className,
    hideArrows,
    hideDots,
    dotProps,
    leftArrowProps,
    rightArrowProps,
    ...rest
  } = props;
  // min duration
  const duration = Math.max(props.duration ?? DEFAULT_DURATION_S, 0.1);
  const autoplayInterval = props.autoplayInterval
    ? Math.max(duration, props.autoplayInterval)
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
    if (autoplayInterval) {
      intervalRef.current = window.setInterval(() => {
        startTransition(1);
      }, autoplayInterval * 1000);
    }

    return () => {
      const interval = intervalRef.current;
      intervalRef.current = null;
      if (interval) {
        clearInterval(interval);
      }
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
    <Box {...rest} className={classNames("aui-carousel", className)} ref={ref}>
      <Box
        className="aui-carousel-slider"
        style={{
          ...animatingStyles,
          flexDirection: delta >= 0 ? "row" : "row-reverse",
        }}
        onTransitionEnd={onTransitionEnd}
      >
        <Box className="aui-carousel-item">{children[cur]}</Box>
        <Box className="aui-carousel-item" aria-hidden>
          {children[next]}
        </Box>
      </Box>
      {length > 1 && (
        <>
          {!hideArrows && (
            <>
              <Button
                className={classNames(
                  "aui-flex-x aui-align-center aui-justify-center aui-carousel-arrow",
                  leftArrowProps?.className
                )}
                style={{ left: 8, ...leftArrowProps?.style }}
                corners="pill"
                aria-label="previous"
                onClick={() => startTransition(-1)}
              >
                {leftArrowProps?.children ?? "←"}
              </Button>
              <Button
                className={classNames(
                  "aui-flex-x aui-align-center aui-justify-center aui-carousel-arrow",
                  rightArrowProps?.className
                )}
                style={{ right: 8, ...rightArrowProps?.style }}
                corners="pill"
                aria-label="next"
                onClick={() => startTransition(1)}
              >
                {rightArrowProps?.children ?? "→"}
              </Button>
            </>
          )}
          {!hideDots && (
            <Box
              layout={{ axis: "x", align: "center", gap: "xs" }}
              className="aui-carousel-dots"
            >
              {children.map((_, i) => (
                <Button
                  key={i}
                  className={classNames(
                    "aui-carousel-dot",
                    dotProps?.className
                  )}
                  corners="pill"
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
});

function safeMod(n: number, m: number): number {
  return ((n % m) + m) % m;
}

export default Carousel;
