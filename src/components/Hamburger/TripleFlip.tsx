import { useMemo } from "react";
import Hamburger, { type Props, flipAngles } from "./Hamburger";

const TripleFlip = (props: Props) => {
  const { direction = "left", ...rest } = props;

  const openStyle = useMemo(() => {
    const topAngle = flipAngles[direction];
    const topTransform = `rotate(${topAngle}deg)`;
    const bottomTransform = `rotate(${-topAngle}deg)`;

    return {
      top: { transform: topTransform },
      middle: { transform: "scale(0)" },
      bottom: { transform: bottomTransform },
    };
  }, [direction]);

  return <Hamburger {...rest} openStyle={openStyle} />;
};

export default TripleFlip;
