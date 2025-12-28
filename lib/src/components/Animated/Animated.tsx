import React, { useState, useEffect, useRef } from "react";
import classNames from "../../functions/classNames";
import type { ArrayLike, Style, Vfx } from "../../utils/types";
import Box, { type BoxProps } from "../Box/Box";

type AnimationState = {
  /**
   * Class to apply to the component when at this state
   */
  className?: string;
  /**
   * Inline styles to apply to the component at this state
   */
  style?: Style;
  /**
   * The VFX or other organizational css to apply at this state
   */
  vfx?: Vfx;
};

type Props = BoxProps & {
  /**
   * Whether to begin the animation and render the component.
   * Set to true to start animation, false to start the exit animation.
   */
  visible: boolean;
  /**
   * Duration of the animation in seconds
   * @default 0.25
   */
  duration?:
    | number
    | {
        /**
         * Length of the forward direction
         */
        forward: number;
        /**
         * Length of the reverse direction
         */
        reverse: number;
      };
  /**
   * Whether to keep the component mounted when it is not animated
   * @default false
   */
  keepMounted?: boolean;
  /**
   * Animation css for the start state
   */
  animateTo?: AnimationState;
  /**
   * animation css for the end state
   */
  animateFrom?: AnimationState;
  /**
   * The properties to apply a transition
   * @default ['all']
   */
  transitionProperties?: ArrayLike<string>;
};

type Phase = "from" | "forward" | "reverse";

const Animated = React.forwardRef<HTMLDivElement, Props>((props, ref) => {
  const {
    visible,
    duration = 0.25,
    keepMounted = false,
    transitionProperties = ["all"],
    animateTo,
    animateFrom,
    className,
    vfx,
    style,
    ...rest
  } = props;

  const forwardDuration =
    typeof duration === "number" ? duration : duration.forward;
  const reverseDuration =
    typeof duration === "number" ? duration : duration.reverse;

  const instantForward = forwardDuration <= 0;
  const instantReverse = reverseDuration <= 0;

  const [phase, setPhase] = useState<Phase>("from");

  const timeoutRef = useRef<number | null>(null);
  const animationFrameRef = useRef<number | null>(null);

  const clearRefs = () => {
    if (timeoutRef.current) {
      clearTimeout(timeoutRef.current);
      timeoutRef.current = null;
    }

    if (animationFrameRef.current) {
      cancelAnimationFrame(animationFrameRef.current);
      animationFrameRef.current = null;
    }
  };

  useEffect(() => {
    clearRefs();

    if (visible) {
      if (phase !== "forward") {
        if (instantForward) {
          setPhase("forward");
        } else {
          animationFrameRef.current = requestAnimationFrame(() =>
            setPhase("forward")
          );
        }
      }
    } else if (phase !== "from") {
      if (instantReverse) {
        setPhase("from");
      } else if (phase !== "reverse") {
        setPhase("reverse");
      } else if (phase === "reverse") {
        timeoutRef.current = window.setTimeout(
          () => setPhase("from"),
          reverseDuration * 1000
        );
      }
    }

    return clearRefs;
  }, [visible, phase, instantForward, instantReverse, reverseDuration]);

  if (phase === "from" && !keepMounted && !visible) return null;

  const currentAnimation =
    phase === "forward" || (visible && instantForward)
      ? animateTo
      : animateFrom;

  let transition: string | undefined = undefined;
  if (phase === "forward" && !instantForward) {
    transition = makeTransition(transitionProperties, forwardDuration);
  } else if (phase === "reverse" && !instantReverse) {
    transition = makeTransition(transitionProperties, reverseDuration);
  }

  return (
    <Box
      className={classNames(className, currentAnimation?.className)}
      style={{
        transition,
        ...style,
        ...currentAnimation?.style,
      }}
      vfx={{ ...vfx, ...currentAnimation?.vfx }}
      {...rest}
      ref={ref}
    />
  );
});

const makeTransition = (
  transitionProperties: ArrayLike<string>,
  duration: number
) =>
  transitionProperties.length > 0
    ? transitionProperties
        .map((prop) => `${prop} ${duration}s ease-in-out`)
        .join(", ")
    : undefined;

export default Animated;
