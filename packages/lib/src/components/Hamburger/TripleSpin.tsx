import { useMemo } from "react";
import Hamburger, { type Props, defaultAngles } from "./Hamburger";

const TripleSpin = (props: Props) => {
  const { direction = "left", ...rest } = props;

  const openStyle = useMemo(() => {
    const topAngle = defaultAngles[direction];
    const topTransform = `rotate(${topAngle}deg)`;
    const bottomTransform = `rotate(${-topAngle}deg)`;

    return {
      top: { transform: topTransform },
      middle: { opacity: 0 },
      bottom: { transform: bottomTransform },
      outer: { transform: "rotate(180deg)" },
    };
  }, [direction]);

  return <Hamburger {...rest} openStyle={openStyle} />;
};

export default TripleSpin;
