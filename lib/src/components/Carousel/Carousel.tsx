import React, { useState, useEffect, useRef, useCallback } from "react";
import { classNames } from "../../functions";
import Button from "../Button";

type ButtonProps = {
  /**
   * Children to render inside the button
   */
  children?: React.ReactNode;
  /**
   * Additional class name to apply to the button
   */
  className?: string;
  /**
   * Additional styles to apply to the button
   */
  style?: React.CSSProperties;
};

type Props = {
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
  /**
   * [Optional] Additional class name to apply to the carousel.
   */
  className?: string;
  /**
   * [Optional] Additional styles to apply to the carousel.
   */
  style?: React.CSSProperties;
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
    style,
    hideArrows,
    hideDots,
    dotProps,
    leftArrowProps,
    rightArrowProps,
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
    <div
      className={classNames("ajui-carousel", className)}
      style={style}
      ref={ref}
    >
      <div
        className="ajui-carousel-slider"
        style={{
          ...animatingStyles,
          flexDirection: delta >= 0 ? "row" : "row-reverse",
        }}
        onTransitionEnd={onTransitionEnd}
      >
        <div className="ajui-carousel-item">{children[cur]}</div>
        <div className="ajui-carousel-item" aria-hidden>
          {children[next]}
        </div>
      </div>
      {length > 1 && (
        <>
          {!hideArrows && (
            <>
              <Button
                className={classNames(
                  "ajui-carousel-arrow-prev",
                  leftArrowProps?.className
                )}
                style={leftArrowProps?.style}
                corners="pill"
                aria-label="previous"
                onClick={() => startTransition(-1)}
              >
                {leftArrowProps?.children ?? "←"}
              </Button>
              <Button
                className={classNames(
                  "ajui-carousel-arrow-next",
                  rightArrowProps?.className
                )}
                style={rightArrowProps?.style}
                corners="pill"
                aria-label="next"
                onClick={() => startTransition(1)}
              >
                {rightArrowProps?.children ?? "→"}
              </Button>
            </>
          )}
          {!hideDots && (
            <div className="ajui-carousel-dots">
              {children.map((_, i) => (
                <Button
                  key={i}
                  className={classNames(
                    "ajui-carousel-dot",
                    dotProps?.className
                  )}
                  corners="pill"
                  disabled={cur === i || animating}
                  onClick={() => startTransition(i - cur)}
                  style={dotProps?.style}
                />
              ))}
            </div>
          )}
        </>
      )}
    </div>
  );
});

function safeMod(n: number, m: number): number {
  return ((n % m) + m) % m;
}

export default Carousel;
