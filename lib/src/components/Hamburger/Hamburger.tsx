import { useMemo } from "react";
import { UnstyledButton } from "../Button";
import type { Style } from "../../types/common";

/** Props shared by all the hamburgers */
export type Props = {
  /**
   * Size of the button in pixels
   * @default 36
   */
  size?: number;
  /** Line height of the bars in pixels */
  lineHeight?: number;
  /**
   * Direction the animation originates from;
   * play around with this to see how it affects the animation because some of the animations are complicated
   * @default "left"
   */
  direction?: "left" | "right";
  /** Whether the button is open or closed */
  open: boolean;
  /** Function to call when the button is clicked, usually should toggle the `open` state */
  onClick?: () => void;
  /**
   * Aria label for the button
   * @default "hamburger"
   */
  "aria-label"?: string;
  /**
   * Duration of the animation in seconds
   * @default 0.25
   */
  duration?: number;
  /** additional class name to apply to the button */
  className?: string;
  /** additional styles to apply to the button */
  style?: Style;
  /**
   * round borders of the bars
   * @default false
   */
  rounded?: boolean;
};

type OpenStyle = {
  outer?: Style;
  top: Style;
  bottom: Style;
  middle?: Style;
};

type InnerProps = Omit<Props, "variant" | "direction"> & {
  double?: boolean;
  openStyle: OpenStyle;
};

/** Default angles for rotate-style hamburger animations */
export const defaultAngles = {
  right: 45,
  left: -45,
} as const;

/** Alternate angles for flip-style hamburger animations */
export const flipAngles = {
  right: -135,
  left: -225,
} as const;

/** Base hamburger button used by the exported hamburger variants */
const Hamburger = (props: InnerProps) => {
  const {
    size = 36,
    duration = 0.25,
    double,
    openStyle,
    open,
    style,
    rounded,
    lineHeight: inputLineHeight,
    ...buttonProps
  } = props;
  const lineHeight = inputLineHeight || Math.max(1, Math.round(size / 20));

  const buttonStyle: Style = {
    width: size,
    height: size,
    display: "flex",
    position: "relative",
    justifyContent: "center",
    alignItems: "center",
    transition: `transform ${duration}s ease`,
  };

  const commonLineStyle: Style = {
    height: lineHeight,
    width: size * 0.7,
    backgroundColor: "currentColor",
    position: "absolute",
    transition: `transform ${duration}s ease, opacity ${duration}s ease`,
    borderRadius: rounded ? 10000 : 0,
  };

  const yTranslateMagnitude = useMemo(
    () => size / (double ? 7 : 4),
    [size, double]
  );

  const { outer, top, middle, bottom } = openStyle;

  const outerStyle = open ? outer : {};
  const topStyle = open
    ? top
    : { transform: `translateY(-${yTranslateMagnitude}px)` };
  const bottomStyle = open
    ? bottom
    : { transform: `translateY(${yTranslateMagnitude}px)` };
  const middleStyle = open ? middle : {};

  return (
    <UnstyledButton
      style={{ ...style, ...outerStyle, ...buttonStyle }}
      {...buttonProps}
      aria-label={buttonProps["aria-label"] || "hamburger"}
      aria-expanded={open}
    >
      <span style={{ ...commonLineStyle, ...topStyle }} />
      {!double && <span style={{ ...commonLineStyle, ...middleStyle }} />}
      <span style={{ ...commonLineStyle, ...bottomStyle }} />
    </UnstyledButton>
  );
};

export default Hamburger;
