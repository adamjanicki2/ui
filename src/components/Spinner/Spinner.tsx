import React from "react";
import { classNames } from "../../utils/util";

type Props = {
  /**
   * [Optional] Additional class names to apply to the spinner.
   */
  className?: string;
  /**
   * [Optional] Additional styles to apply to the spinner.
   */
  style?: React.CSSProperties;
};

const Spinner = ({ className, ...props }: Props) => (
  // Designed on 2023-08-18
  <svg
    xmlns="http://www.w3.org/2000/svg"
    viewBox="0 0 512 512"
    className={classNames("ajui-spinner", className)}
    {...props}
  >
    <path
      fill="currentColor"
      d="M256,0C114.62,0,0,114.62,0,256S114.62,512,256,512c70.64,0,134.59-28.61,180.91-74.88l-31.11-31.11c-38.35,38.3-91.31,61.99-149.8,61.99-117.08,0-212-94.92-212-212S138.92,44,256,44V0Z"
    />
  </svg>
);

export default Spinner;
