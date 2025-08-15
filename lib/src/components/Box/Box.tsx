import React from "react";
import type { DivProps } from "../../types";
import { getSizePixelValue, type Size } from "../../utils/size";

type Props = DivProps & {
  axis: "x" | "y";
  gap?: Size;
  align?: "start" | "center" | "end";
  spacing?: "start" | "even" | "between" | "end";
  padding?: Size;
  margin?: Size;
  wrap?: boolean;
};

const Box = React.forwardRef<HTMLDivElement, Props>((props, ref) => (
  <div {...props} ref={ref} />
));

export default Box;
