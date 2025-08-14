import React from "react";
import type { ContentType, CornerType, DivProps } from "../../types";
import classNames from "../../functions/classNames";

type Props = DivProps & {
  /**
   * The type of alert to display.
   */
  type: ContentType;
  /**
   * [Optional] The corner style of the alert.
   * @default "rounded"
   */
  corners?: CornerType;
};

const Alert = React.forwardRef<HTMLDivElement, Props>(
  ({ type, className, corners = "rounded", ...rest }, ref) => (
    <div
      {...rest}
      className={classNames(
        `ajui-alert ajui-content--${type} ajui-corners--${corners}`,
        className
      )}
      ref={ref}
    />
  )
);

export default Alert;
