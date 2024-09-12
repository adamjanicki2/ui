import { useMemo } from "react";
import { UnstyledButton } from "../Button";

export type Props = {
  /**
   * Size of the button in pixels
   * @default 36
   */
  size?: number;
  /**
   * Direction the animation originates from;
   * play around with this to see how it affects the animation because some of the animations are complicated
   * @default "left"
   */
  direction?: "left" | "right";
  /**
   * Whether the button is open or closed
   */
  open: boolean;
  /**
   * Function to call when the button is clicked, usually should toggle the `open` state
   */
  onClick?: () => void;
  /**
   * Aria label for the button
   */
  "aria-label": string;
  /**
   * Duration of the animation in seconds
   * @default 0.25
   */
  duration?: number;
  /**
   * [Optional] additional class name to apply to the button
   */
  className?: string;
  /**
   * [Optional] additional styles to apply to the button
   */
  style?: React.CSSProperties;
};

type OpenStyle = {
  outer?: React.CSSProperties;
  top: React.CSSProperties;
  bottom: React.CSSProperties;
  middle?: React.CSSProperties;
};

type InnerProps = Omit<Props, "variant" | "direction"> & {
  double?: boolean;
  openStyle: OpenStyle;
};

export const defaultAngles = {
  right: 45,
  left: -45,
} as const;

export const flipAngles = {
  right: -135,
  left: -225,
} as const;

const Hamburger = (props: InnerProps) => {
  const {
    size = 36,
    duration = 0.25,
    double,
    openStyle,
    open,
    style,
    ...buttonProps
  } = props;
  const lineHeight = Math.max(1, Math.round(size / 20));

  const buttonStyle: React.CSSProperties = {
    width: size,
    height: size,
    display: "flex",
    position: "relative",
    justifyContent: "center",
    alignItems: "center",
    transition: `all ${duration}s ease`,
  };

  const commonLineStyle: React.CSSProperties = {
    height: lineHeight,
    width: size * 0.7,
    backgroundColor: "currentColor",
    position: "absolute",
    transition: `all ${duration}s ease`,
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
    >
      <span style={{ ...commonLineStyle, ...topStyle }} />
      {!double && <span style={{ ...commonLineStyle, ...middleStyle }} />}
      <span style={{ ...commonLineStyle, ...bottomStyle }} />
    </UnstyledButton>
  );
};

export default Hamburger;
