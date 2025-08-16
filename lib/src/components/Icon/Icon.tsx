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
   * Size of the icon
   */
  size?: number;
};

const defaultViewBox = "0 0 512 512";

const Icon = React.forwardRef<SVGSVGElement, Props>(
  ({ icon, className, size, style, ...rest }, ref) => {
    const { contents, viewBox } = icons[icon];
    return (
      <svg
        xmlns="http://www.w3.org/2000/svg"
        viewBox={viewBox || defaultViewBox}
        className={classNames("aui-icon", className)}
        style={{ width: size, height: size, ...style }}
        {...rest}
        ref={ref}
      >
        {contents.map((icon, i) => (
          <React.Fragment key={i}>{icon}</React.Fragment>
        ))}
      </svg>
    );
  }
);

export default Icon;
