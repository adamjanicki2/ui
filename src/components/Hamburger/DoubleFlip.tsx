import { useMemo } from "react";
import Hamburger, { type Props, flipAngles } from "./Hamburger";

const DoubleFlip = (props: Props) => {
  const { direction = "left", ...rest } = props;

  const openStyle = useMemo(() => {
    const topAngle = flipAngles[direction];
    const topTransform = `rotate(${topAngle}deg)`;
    const bottomTransform = `rotate(${-topAngle}deg)`;

    return {
      top: { transform: topTransform },
      bottom: { transform: bottomTransform },
    };
  }, [direction]);

  return <Hamburger {...rest} double openStyle={openStyle} />;
};

export default DoubleFlip;
