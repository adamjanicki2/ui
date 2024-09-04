import React, { useState, useEffect } from "react";
import classNames from "../../functions/classNames";

type Props = {
  /**
   * Whether the component is visible or not
   */
  visible: boolean;
  /**
   * Duration of the animation in milliseconds
   */
  duration?: number;
  /**
   * Whether to keep the component mounted when it is not visible
   */
  keepMountedOnExit?: boolean;
  /**
   * Animation configuration for the enter state
   */
  enter?: {
    /**
     * Class name to apply to the component during the enter animation
     */
    className?: string;
    /**
     * Inline styles to apply to the component during the enter animation
     */
    style?: React.CSSProperties;
  };
  exit?: {
    /**
     * Class name to apply to the component during the exit animation
     */
    className?: string;
    /**
     * Inline styles to apply to the component during the exit animation
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
  visible,
  duration = 250,
  keepMountedOnExit = false,
  enter,
  exit,
  children,
  className,
  style,
}: Props) => {
  const [shouldRender, setShouldRender] = useState(visible);
  const [animationState, setAnimationState] = useState<"entering" | "exiting">(
    visible ? "entering" : "exiting"
  );

  useEffect(() => {
    let timeoutId: ReturnType<typeof setTimeout>;

    if (visible && !shouldRender) {
      // Start enter animation
      setShouldRender(true);
      setAnimationState("entering");
    } else if (!visible && shouldRender) {
      // Start exit animation
      setAnimationState("exiting");
      timeoutId = setTimeout(() => {
        if (!keepMountedOnExit) {
          setShouldRender(false);
        }
      }, duration);
    }

    return () => clearTimeout(timeoutId);
  }, [visible, shouldRender, duration, keepMountedOnExit]);

  return (
    <div
      className={classNames(
        className,
        animationState === "entering" ? enter?.className : exit?.className
      )}
      style={{
        ...style,
        ...(animationState === "entering" ? enter?.style : exit?.style),
        transition: `all ${duration}ms ease-in-out`,
      }}
    >
      {shouldRender && children}
    </div>
  );
};

export default Animated;
