import classNames from "../../functions/classNames";
import type { Style } from "../../utils/types";

type Props = {
  /**
   * [Optional] Additional class names to apply to the spinner.
   */
  className?: string;
  /**
   * [Optional] Additional styles to apply to the spinner.
   */
  style?: Style;
};

const Spinner = ({ className, ...props }: Props) => (
  // Designed on 2023-08-18
  // Updated on 2025-08-22
  <svg
    xmlns="http://www.w3.org/2000/svg"
    viewBox="0 0 16 16"
    className={classNames("aui-spinner", className)}
    {...props}
  >
    <path
      d="M8,0C3.5819,0,0,3.5819,0,8s3.5819,8,8,8c2.2075,0,4.2059-.8941,5.6534-2.34l-.9722-.9722c-1.1984,1.1969-2.8534,1.9372-4.6813,1.9372-3.6588,0-6.625-2.9662-6.625-6.625S4.3412,1.375,8,1.375V0Z"
      fill="currentColor"
    />
  </svg>
);

export default Spinner;
