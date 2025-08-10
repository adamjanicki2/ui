import React, { useState, useEffect, useRef } from "react";
import classNames from "../../functions/classNames";

type Props = {
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
    style?: React.CSSProperties;
  };
  animateFrom?: {
    /**
     * Class name to apply to the component when not animated (before state)
     */
    className?: string;
    /**
     * Inline styles to apply to the component when not animated
     */
    style?: React.CSSProperties;
  };
  /**
   * Children to render
   */
  children: React.ReactNode | React.ReactNode[];
  /**
   * [Optional] className to apply to the component always
   */
  className?: string;
  /**
   * [Optional] Inline styles to apply to the component always
   */
  style?: React.CSSProperties;
};

const Animated = ({
  animated,
  duration = 0.25,
  keepMounted = false,
  animateTo,
  animateFrom,
  children,
  className,
  style,
}: Props) => {
  const [shouldRender, setShouldRender] = useState(animated || keepMounted);
  const [animationState, setAnimationState] = useState<"forward" | "reverse">(
    animated ? "forward" : "reverse"
  );

  const timeoutRef = useRef<number | null>(null);

  useEffect(() => {
    if (timeoutRef.current) {
      clearTimeout(timeoutRef.current);
      timeoutRef.current = null;
    }

    if (animated) {
      setShouldRender(true);
      // Use requestAnimationFrame to ensure browser paints the visible state
      requestAnimationFrame(() => setAnimationState("forward"));
    } else {
      setAnimationState("reverse");

      timeoutRef.current = window.setTimeout(() => {
        if (!keepMounted) {
          setShouldRender(false);
        }
        timeoutRef.current = null;
        // convert to ms
      }, duration * 1000);
    }

    return () => {
      if (timeoutRef.current) {
        clearTimeout(timeoutRef.current);
        timeoutRef.current = null;
      }
    };
  }, [animated, duration, keepMounted, shouldRender]);

  if (!shouldRender) return null;

  const currentAnimation =
    animationState === "forward" ? animateTo : animateFrom;

  return (
    <div
      className={classNames(className, currentAnimation?.className)}
      style={{
        transition: `all ${duration}s ease-in-out`,
        ...style,
        ...currentAnimation?.style,
      }}
    >
      {children}
    </div>
  );
};

export default Animated;
