import React from "react";
import RouterContext from "./RouterContext";
import PathParamsContext from "./PathParamsContext";
import type { Location, Navigate, PathParams } from "./types";

function makeError(name: string) {
  return Error(`${name} must be used inside of a <Router> component`);
}

export function useRouterContext(name: string) {
  const routerContext = React.useContext(RouterContext);
  if (!routerContext) {
    throw makeError(name);
  }

  return routerContext;
}

/**
 * Get the current location (can only be used within a Router)
 *
 * @returns the current location
 */
export function useLocation(): Location {
  const { location } = useRouterContext("useLocation()");
  return location;
}

/**
 * Get a navigate function (can only be used within a Router)
 *
 * @returns a navigate function
 */
export function useNavigate(): Navigate {
  const { navigate } = useRouterContext("useNavigate()");
  return navigate;
}

/**
 * Get the params from the current pathname
 *
 * @returns the params from the current path
 * e.g. `{id: "1"}` for `/movie/:id <=> /movie/1`
 */
export function usePathParams(): PathParams {
  const params = React.useContext(PathParamsContext);
  if (!params) {
    throw makeError("usePathParams()");
  }

  return params;
}
