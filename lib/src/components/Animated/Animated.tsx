import React, { useState, useEffect, useRef } from "react";
import classNames from "../../functions/classNames";
import type { Style } from "../../utils/types";
import Box, { type BoxProps } from "../Box/Box";

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
   * Animation configuration for the enter state
   */
  animateTo?: {
    /**
     * Class name to apply to the component while animated (after state)
     */
    className?: string;
    /**
     * Inline styles to apply to the component while animated
     */
    style?: Style;
  };
  animateFrom?: {
    /**
     * Class name to apply to the component when not animated (before state)
     */
    className?: string;
    /**
     * Inline styles to apply to the component when not animated
     */
    style?: Style;
  };
  debug?: true;
};

const Animated = React.forwardRef<HTMLDivElement, Props>((props, ref) => {
  const {
    visible,
    duration = 0.25,
    keepMounted = false,
    animateTo,
    animateFrom,
    className,
    style,
    debug,
    ...rest
  } = props;

  let forwardDuration: number;
  let reverseDuration: number;
  if (typeof duration === "number") {
    forwardDuration = duration;
    reverseDuration = duration;
  } else {
    forwardDuration = duration.forward;
    reverseDuration = duration.reverse;
  }

  const [shouldRender, setShouldRender] = useState(visible || keepMounted);
  const [isAnimatingForward, setIsAnimatingForward] = useState(visible);

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
      setShouldRender(true);
      animationFrameRef.current = requestAnimationFrame(() =>
        setIsAnimatingForward(true)
      );
    } else {
      setIsAnimatingForward(false);
      timeoutRef.current = window.setTimeout(() => {
        if (!keepMounted) {
          setShouldRender(false);
        }
      }, reverseDuration * 1000);
    }
  }, [visible, keepMounted, reverseDuration]);

  if (debug) console.log({ visible, shouldRender, isAnimatingForward });

  if (!shouldRender) return null;

  const transition = `all ${
    isAnimatingForward ? forwardDuration : reverseDuration
  }s ease-in-out`;

  const currentAnimation = isAnimatingForward ? animateTo : animateFrom;

  return (
    <Box
      className={classNames(className, currentAnimation?.className)}
      style={{
        transition,
        ...style,
        ...currentAnimation?.style,
      }}
      {...rest}
      ref={ref}
    />
  );
});

export default Animated;
