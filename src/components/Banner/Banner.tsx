import React from "react";
import { ContentType } from "../../utils/types";
import { classNames } from "../../utils/util";

type Props = {
  /**
   * The type of badge to display.
   */
  type: ContentType;
  /**
   * The content to display in the banner.
   */
  children: React.ReactNode;
  /**
   * [Optional] Additional class names to apply to the banner.
   */
  className?: string;
  /**
   * [Optional] Additional styles to apply to the banner.
   */
  style?: React.CSSProperties;
};

const Banner = ({ type, className, ...rest }: Props) => {
  return (
    <div
      className={classNames(`content--${type} ajui-banner`, className)}
      {...rest}
    />
  );
};

export default Banner;
