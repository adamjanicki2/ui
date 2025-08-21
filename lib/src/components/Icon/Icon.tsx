import React from "react";
import icons, { type IconType } from "./icons";
import { classNames } from "../../functions";

type Props = Omit<
  React.DetailedHTMLProps<React.SVGAttributes<SVGSVGElement>, SVGSVGElement>,
  "children" | "viewBox"
> & {
  /**
   * The version of icon to render
   */
  icon: IconType;
  /**
   * Size of the icon; will control both width and height
   * @default "s"
   */
  size?: "xxs" | "xs" | "s" | "m" | "l" | "xl" | "xxl";
};

const Icon = React.forwardRef<SVGSVGElement, Props>(
  ({ icon, className, size = "s", ...rest }, ref) => (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      viewBox="0 0 16 16"
      className={classNames("aui-icon", `aui-icon-${size}`, className)}
      {...rest}
      ref={ref}
    >
      {icons[icon]}
    </svg>
  )
);

export default Icon;
