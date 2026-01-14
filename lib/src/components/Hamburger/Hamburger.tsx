import { useMemo } from "react";

import type { Style } from "../../types/common";
import { DEFAULT_ANIMATION_DURATION_S } from "../Animated/Animated";
import Box from "../Box";
import { UnstyledButton } from "../Button";

type ButtonProps = React.ComponentProps<typeof UnstyledButton>;

/** Props shared by all the hamburgers */
type Props = Omit<ButtonProps, "children" | "aria-expanded"> & {
  /**
   * Size of the button in pixels.
   * @default 36
   */
  size?: number;
  /** Height of the bars in pixels */
  barHeight?: number;
  /**
   * Direction the animation originates from.
   * Play around with this to see how it affects the animation because some of the animations are complicated.
   * @default "left"
   */
  direction?: "left" | "right";
  /** Whether the button is open or closed */
  open: boolean;
  /**
   * Duration of the animation in seconds.
   * @default 0.25
   */
  duration?: number;
  /** Whether to round the borders of the bars */
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
const defaultAngles = {
  right: 45,
  left: -45,
} as const;

/** Alternate angles for flip-style hamburger animations */
const flipAngles = {
  right: -135,
  left: -225,
} as const;

/** Base hamburger button used by the exported hamburger variants */
const Hamburger = (props: InnerProps) => {
  const {
    size = 36,
    duration = DEFAULT_ANIMATION_DURATION_S,
    double,
    openStyle,
    open,
    style,
    rounded,
    barHeight: inputBarHeight,
    ...buttonProps
  } = props;
  const barHeight = inputBarHeight || Math.max(1, Math.round(size / 20));

  const buttonStyle: Style = {
    width: size,
    height: size,
    display: "flex",
    position: "relative",
    justifyContent: "center",
    alignItems: "center",
    transition: `transform ${duration}s`,
  };

  const commonBarStyle: Style = {
    height: barHeight,
    width: size * 0.7,
    backgroundColor: "currentColor",
    position: "absolute",
    transition: `transform ${duration}s, opacity ${duration}s`,
    borderRadius: rounded ? 10000 : 0,
  };

  const yMag = size / (double ? 7 : 4);

  const { outer, top, middle, bottom } = openStyle;

  const outerStyle = open ? outer : {};
  const topStyle = open ? top : { transform: `translateY(-${yMag}px)` };
  const bottomStyle = open ? bottom : { transform: `translateY(${yMag}px)` };
  const middleStyle = open ? middle : {};

  return (
    <UnstyledButton
      {...buttonProps}
      aria-expanded={open}
      style={{ ...style, ...outerStyle, ...buttonStyle }}
    >
      <Box style={{ ...commonBarStyle, ...topStyle }} />
      {!double && <Box style={{ ...commonBarStyle, ...middleStyle }} />}
      <Box style={{ ...commonBarStyle, ...bottomStyle }} />
    </UnstyledButton>
  );
};

type HamburgerConfig = {
  angles: typeof defaultAngles | typeof flipAngles;
  double?: boolean;
  middle?: Style;
  outer?: Style;
};

const makeHamburger =
  ({ angles, double, middle, outer }: HamburgerConfig) =>
  (props: Props) => {
    const { direction = "left", ...rest } = props;

    const openStyle = useMemo(() => {
      const angle = angles[direction];

      const style: OpenStyle = {
        top: { transform: `rotate(${angle}deg)` },
        bottom: { transform: `rotate(${-angle}deg)` },
      };

      if (middle) style.middle = middle;
      if (outer) style.outer = outer;

      return style;
    }, [direction]);

    return <Hamburger {...rest} double={double} openStyle={openStyle} />;
  };

/** A double-bar "cross" hamburger */
export const DoubleCross = makeHamburger({
  angles: defaultAngles,
  double: true,
});

/** A double-bar "flip" hamburger */
export const DoubleFlip = makeHamburger({ angles: flipAngles, double: true });

/** A double-bar "spin" hamburger */
export const DoubleSpin = makeHamburger({
  angles: defaultAngles,
  double: true,
  outer: { transform: "rotate(180deg)" },
});

/** A three-bar "spin" hamburger */
export const TripleSpin = makeHamburger({
  angles: defaultAngles,
  middle: { opacity: 0 },
  outer: { transform: "rotate(180deg)" },
});

/** A three-bar "flip" hamburger */
export const TripleFlip = makeHamburger({
  angles: flipAngles,
  middle: { transform: "scale(0)" },
});

/** A three-bar hamburger that fades the middle bar */
export const TripleFade = makeHamburger({
  angles: defaultAngles,
  middle: { opacity: 0 },
});

/** The default hamburger */
export const TriplePrestige = makeHamburger({
  angles: defaultAngles,
  middle: { transform: "scale(0)" },
});
