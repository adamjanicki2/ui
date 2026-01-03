import React from "react";
import { classNames } from "../../functions";
import type { SizeToken } from "../../types/common";
import ui from "../ui";
import type { IconType } from "../../types/icon";

/** Props for `Icon`. */
export type Props = Omit<
  React.ComponentProps<typeof ui.svg>,
  "children" | "viewBox"
> & {
  /**
   * Icon type to render (import from `components/Icon/icons`)
   */
  icon: IconType;
  /**
   * Size of the icon; will control both width and height
   * @default "s"
   */
  size?: SizeToken;
};

/**
 * Render from a selected set of defined icon paths
 * Icons can be imported from `/icons`
 */
const Icon = React.forwardRef<SVGSVGElement, Props>(
  ({ icon, className, size = "s", ...rest }, ref) => (
    <ui.svg
      xmlns="http://www.w3.org/2000/svg"
      viewBox="0 0 16 16"
      className={classNames("aui-icon", `aui-icon-${size}`, className)}
      {...rest}
      ref={ref}
    >
      <ui.path d={icon} />
    </ui.svg>
  )
);

export default Icon;
