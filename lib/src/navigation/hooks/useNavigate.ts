import type { Navigate } from "../helpers";
import useRouterContext from "./useRouterContext";

/**
 * Get a navigate function (can only be used within a Router)
 *
 * @returns a navigate function
 */
export default function useNavigate(): Navigate {
  const { navigate } = useRouterContext("useNavigate()");
  return navigate;
}
