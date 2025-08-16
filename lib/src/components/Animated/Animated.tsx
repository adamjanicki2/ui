import React, { useState, useEffect, useRef } from "react";
import classNames from "../../functions/classNames";
import type { Style } from "../../utils/types";
import Box, { type BoxProps } from "../Box/Box";

type Props = BoxProps & {
  /**
   * Whether to begin the animation.
   * Set to true to start animation, false to start the exit animation.
   */
  animated: boolean;
  /**
   * Duration of the animation in seconds
   * @default 0.25
   */
  duration?: number;
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
};

const Animated = React.forwardRef<HTMLDivElement, Props>((props, ref) => {
  const {
    animated,
    duration = 0.25,
    keepMounted = false,
    animateTo,
    animateFrom,
    className,
    style,
    ...rest
  } = props;

  const [shouldRender, setShouldRender] = useState(animated || keepMounted);
  const [isAnimatingForward, setIsAnimatingForward] = useState(false);

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
    // initiate forward animation
    if (animated && shouldRender) {
      clearRefs();
      animationFrameRef.current = requestAnimationFrame(() =>
        setIsAnimatingForward(true)
      );
    }

    return clearRefs;
  }, [animated, shouldRender]);

  useEffect(() => {
    // make container element appear on DOM
    if (animated) {
      setShouldRender(true);
    }
    // initiate reverse animation
    else {
      clearRefs();
      setIsAnimatingForward(false);
      timeoutRef.current = window.setTimeout(() => {
        if (!keepMounted) {
          setShouldRender(false);
        }
      }, duration * 1000);
    }

    return clearRefs;
  }, [animated, duration, keepMounted]);

  if (!shouldRender) return null;

  const currentAnimation = isAnimatingForward ? animateTo : animateFrom;

  return (
    <Box
      className={classNames(className, currentAnimation?.className)}
      style={{
        transition: `all ${duration}s ease-in-out`,
        ...style,
        ...currentAnimation?.style,
      }}
      {...rest}
      ref={ref}
    />
  );
});

export default Animated;
