import type { Location } from "../types/navigation";
import useRouterContext from "./useRouterContext";

/**
 * Get the current location (can only be used within a Router).
 *
 * @returns The current location.
 */
export default function useLocation(): Location {
  return useRouterContext("useLocation()").location;
}
