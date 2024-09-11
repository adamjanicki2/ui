import { UnstyledButton } from "../Button";

type Props = {
  /**
   * Size of the button in pixels
   * @default 36
   */
  size?: number;
  /**
   * Direction of the animation
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
  /**
   * Variant of the hamburger button
   * @default "triple-vanish"
   */
  variant?: "double" | "triple-vanish" | "triple-fade";
};

type InnerProps = Omit<Props, "variant"> & {
  bars: 2 | 3;
  middleStyle?: (open: boolean) => React.CSSProperties;
};

const barsToYTransform = {
  2: 7,
  3: 4,
} as const;

const BaseHamburger = (props: InnerProps) => {
  const {
    size = 36,
    direction = "left",
    open,
    duration = 0.25,
    bars,
    middleStyle,
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
  };

  const commonLineStyle: React.CSSProperties = {
    height: lineHeight,
    width: size * 0.7,
    backgroundColor: "currentColor",
    position: "absolute",
    transition: `all ${duration}s ease`,
  };

  const yTranslateMagnitude = size / barsToYTransform[bars];
  const transformTop = open
    ? direction === "right"
      ? "rotate(45deg)"
      : "rotate(-45deg)"
    : `translateY(-${yTranslateMagnitude}px)`;
  const transformBottom = open
    ? direction === "right"
      ? "rotate(-45deg)"
      : "rotate(45deg)"
    : `translateY(${yTranslateMagnitude}px)`;

  return (
    <UnstyledButton style={{ ...style, ...buttonStyle }} {...buttonProps}>
      <span style={{ ...commonLineStyle, transform: transformTop }} />
      {bars === 3 && (
        <span style={{ ...commonLineStyle, ...middleStyle?.(open) }} />
      )}
      <span style={{ ...commonLineStyle, transform: transformBottom }} />
    </UnstyledButton>
  );
};

const Hamburger = (props: Props) => {
  const { variant = "triple-vanish", ...rest } = props;
  switch (variant) {
    case "double":
      return <BaseHamburger {...rest} bars={2} />;
    case "triple-fade":
      return (
        <BaseHamburger
          {...rest}
          bars={3}
          middleStyle={(open) => ({
            opacity: open ? 0 : 1,
          })}
        />
      );
    case "triple-vanish":
    default:
      return (
        <BaseHamburger
          {...rest}
          bars={3}
          middleStyle={(open) => ({
            transform: open ? "scale(0)" : "translateY(0)",
          })}
        />
      );
  }
};

export default Hamburger;
