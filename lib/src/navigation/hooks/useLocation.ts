import type { Location } from "../helpers";
import useRouterContext from "./useRouterContext";

/**
 * Get the current location (can only be used within a Router)
 *
 * @returns the current location
 */
export default function useLocation(): Location {
  const { location } = useRouterContext("useLocation()");
  return location;
}
