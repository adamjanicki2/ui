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
  children: string;
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

const Alert = ({ type, className, corners = "rounded", ...rest }: Props) => {
  return (
    <div
      className={classNames(
        `ajui-alert content--${type} corners--${corners}`,
        className
      )}
      {...rest}
    />
  );
};

export default Alert;
