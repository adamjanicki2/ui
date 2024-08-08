import React from "react";
import { ContentType, CornerType } from "../../utils/types";
import { classNames } from "../../utils/util";

type Props = {
  /**
   * The type of alert to display.
   */
  type: ContentType;
  /**
   * The content to display in the alert.
   */
  children: React.ReactNode | React.ReactNode[];
  /**
   * [Optional] Additional class names to apply to the alert.
   */
  className?: string;
  /**
   * [Optional] Additional styles to apply to the alert.
   */
  style?: React.CSSProperties;
  /**
   * [Optional] The corner style of the alert.
   * @default "rounded"
   */
  corners?: CornerType;
};

const Alert = React.forwardRef<HTMLDivElement, Props>(
  ({ type, className, corners = "rounded", ...rest }, ref) => (
    <div
      className={classNames(
        `ajui-alert content--${type} corners--${corners}`,
        className
      )}
      ref={ref}
      {...rest}
    />
  )
);

export default Alert;
