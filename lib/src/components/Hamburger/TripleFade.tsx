import { useMemo } from "react";

import Hamburger, { defaultAngles, type Props } from "./Hamburger";

/** A three-bar hamburger that fades the middle bar */
const TripleFade = (props: Props) => {
  const { direction = "left", ...rest } = props;

  const openStyle = useMemo(() => {
    const topAngle = defaultAngles[direction];
    const topTransform = `rotate(${topAngle}deg)`;
    const bottomTransform = `rotate(${-topAngle}deg)`;

    return {
      top: { transform: topTransform },
      middle: { opacity: 0 },
      bottom: { transform: bottomTransform },
    };
  }, [direction]);

  return <Hamburger {...rest} openStyle={openStyle} />;
};

export default TripleFade;
