import React, { useEffect, useRef, useState } from "react";
import type { ReadonlyableArray, Style } from "../../types/common";
import Box, { type BoxProps } from "../Box/Box";

type Props = BoxProps & {
  /**
   * Whether to begin the animation and render the component.
   * Set to true to start animation, false to start the exit animation.
   */
  visible: boolean;
  /**
   * Duration of the animation in seconds.
   * @default 0.25
   */
  duration?:
    | number
    | {
        /** Length of the forward direction */
        forward: number;
        /** Length of the reverse direction */
        reverse: number;
      };
  /**
   * Whether to keep the component mounted when it is not animated.
   * @default false
   */
  keepMounted?: boolean;
  /** Style applied at the start state */
  animateTo?: Style;
  /** Style applied at the end state */
  animateFrom?: Style;
  /**
   * The properties to apply a transition.
   * @default ['all']
   */
  transitionProperties?: ReadonlyableArray<string>;
};

type Phase = "from" | "forward" | "reverse";

/** Wrapper for animating enter/exit states */
const Animated = React.forwardRef<HTMLDivElement, Props>((props, ref) => {
  const {
    visible,
    duration = 0.25,
    keepMounted = false,
    transitionProperties = ["all"],
    animateTo,
    animateFrom,
    style,
    ...rest
  } = props;

  const forwardDuration =
    typeof duration === "number" ? duration : duration.forward;
  const reverseDuration =
    typeof duration === "number" ? duration : duration.reverse;

  const instantForward = forwardDuration <= 0;
  const instantReverse = reverseDuration <= 0;

  // initialize based on whether we can instantly render
  const [phase, setPhase] = useState<Phase>(() =>
    visible && instantForward ? "forward" : "from"
  );

  const timeoutRef = useRef<number | null>(null);
  const animationFrameRef = useRef<number | null>(null);

  useEffect(() => {
    // cases where no update is needed; already in correct phase
    if (visible && instantForward && phase === "forward") return;
    if (!visible && instantReverse && phase === "from") return;

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
      } else if (phase === "forward") {
        setPhase("reverse");
      } else {
        timeoutRef.current = window.setTimeout(
          () => setPhase("from"),
          reverseDuration * 1000
        );
      }
    }

    // clean up refs
    return () => {
      if (timeoutRef.current !== null) {
        clearTimeout(timeoutRef.current);
        timeoutRef.current = null;
      }

      if (animationFrameRef.current !== null) {
        cancelAnimationFrame(animationFrameRef.current);
        animationFrameRef.current = null;
      }
    };
  }, [visible, phase, instantForward, instantReverse, reverseDuration]);

  if (phase === "from" && !keepMounted && !visible) return null;

  const stateStyle =
    phase === "forward" || (visible && instantForward)
      ? animateTo
      : animateFrom;

  let transitionProperty: string | undefined;
  let transitionDuration: number | undefined;

  if (phase === "forward" && !instantForward) {
    transitionDuration = forwardDuration;
    transitionProperty = makeTransitionProperty(transitionProperties);
  } else if (phase === "reverse" && !instantReverse) {
    transitionDuration = reverseDuration;
    transitionProperty = makeTransitionProperty(transitionProperties);
  }

  return (
    <Box
      style={{
        ...style,
        ...stateStyle,
        transitionProperty,
        transitionDuration: transitionDuration
          ? `${transitionDuration}s`
          : undefined,
      }}
      {...rest}
      ref={ref}
    />
  );
});

const makeTransitionProperty = (props: ReadonlyableArray<string>) =>
  props.length <= 0 ? undefined : props.join(", ");

export default Animated;
