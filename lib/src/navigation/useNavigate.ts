import type { Navigate } from "../types/navigation";
import useRouterContext from "./useRouterContext";

/**
 * Get a navigate function (can only be used within a Router).
 *
 * @returns A Navigate function.
 */
export default function useNavigate(): Navigate {
  return useRouterContext("useNavigate()").navigate;
}
