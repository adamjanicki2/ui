import React from "react";
import { RouterContext } from "./context";
import type { Location, Navigate } from "./types";

function useRouterContext() {
  const routerContext = React.useContext(RouterContext);
  if (!routerContext) {
    throw new Error("This must be used within a <Router>");
  }

  return routerContext;
}

/**
 * Get the current location (can only be used within a Router)
 *
 * @returns the current location
 */
export function useLocation(): Location {
  const { location } = useRouterContext();
  return location;
}

/**
 * Get a navigate function (can only be used within a Router)
 *
 * @returns a navigate function
 */
export function useNavigate(): Navigate {
  const { navigate } = useRouterContext();
  return navigate;
}
