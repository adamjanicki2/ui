import React from "react";
import { ContentType, CornerType } from "../../utils/types";
import { classNames } from "../../utils/util";

type Props = {
  /**
   * The type of badge to display.
   */
  type: ContentType;
  /**
   * The content to display in the badge.
   * Should be short.
   */
  children: React.ReactNode | React.ReactNode[];
  /**
   * [Optional] Additional class names to apply to the badge.
   */
  className?: string;
  /**
   * [Optional] Additional styles to apply to the badge.
   */
  style?: React.CSSProperties;
  /**
   * [Optional] The corner style of the badge.
   * @default "rounded"
   */
  corners?: CornerType;
};

const Badge = React.forwardRef<HTMLDivElement, Props>(
  ({ type, className, corners = "rounded", ...rest }, ref) => (
    <div
      className={classNames(
        `ajui-badge content--${type} corners--${corners}`,
        className
      )}
      ref={ref}
      {...rest}
    />
  )
);

export default Badge;
