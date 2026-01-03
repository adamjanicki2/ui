import classNames from "../../functions/classNames";
import ui from "../ui";

type Props = Omit<React.ComponentProps<typeof ui.svg>, "children" | "viewBox">;

/** Animated loading spinner */
const Spinner = ({ className, ...props }: Props) => (
  // Designed on 2023-08-18
  <ui.svg
    xmlns="http://www.w3.org/2000/svg"
    {...props}
    viewBox="0 0 512 512"
    className={classNames("aui-spinner", className)}
  >
    <path
      fill="currentColor"
      d="M256,0C114.62,0,0,114.62,0,256S114.62,512,256,512c70.64,0,134.59-28.61,180.91-74.88l-31.11-31.11c-38.35,38.3-91.31,61.99-149.8,61.99-117.08,0-212-94.92-212-212S138.92,44,256,44V0Z"
    />
  </ui.svg>
);

export default Spinner;
