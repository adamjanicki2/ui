import React from "react";
import icons, { type IconType } from "./icons";
import { classNames } from "../../functions";
import type { SizeToken } from "../../utils/types";
import ui from "../ui";

export type Props = Omit<
  React.ComponentProps<typeof ui.svg>,
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
  size?: SizeToken;
};

const Icon = React.forwardRef<SVGSVGElement, Props>(
  ({ icon, className, size = "s", ...rest }, ref) => (
    <ui.svg
      xmlns="http://www.w3.org/2000/svg"
      viewBox="0 0 16 16"
      className={classNames("aui-icon", `aui-icon-${size}`, className)}
      {...rest}
      ref={ref}
    >
      <path d={icons[icon]} />
    </ui.svg>
  )
);

export default Icon;
