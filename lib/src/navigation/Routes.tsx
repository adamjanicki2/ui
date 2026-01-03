import React from "react";
import { matchPath } from "./path";
import PathParamsContext from "./PathParamsContext";
import Route, { type Props as RouteProps } from "./Route";
import type { Children, ReadonlyableArray } from "../types/common";
import useRouterContext from "./useRouterContext";
import { stripBasename } from "./href";

export type Props = {
  /**
   * Child <Route> elements to switch between.
   * Note: non <Route> children will be silently ignored.
   */
  children: Children;
  /** What to render when no routes match, like a 404 page */
  fallback?: React.ReactNode;
};

function findRouteElements(children: ReadonlyableArray<React.ReactNode>) {
  return children.filter(
    (child) => React.isValidElement(child) && child.type === Route
  ) as React.ReactElement<RouteProps, typeof Route>[];
}

/**
 * Nested within a router component, this component handles rendering the proper route.
 * Note: sticking any other components besides routes in here will not be rendered.
 */
export default function Routes({
  children: rawChildren,
  fallback,
}: Props): React.ReactNode {
  const router = useRouterContext("<Routes>");
  const { location, basename } = router;
  const pathname = stripBasename(location.pathname, basename);

  const children = Array.isArray(rawChildren) ? rawChildren : [rawChildren];

  const routes = findRouteElements(children);

  for (const routeElement of routes) {
    const { path, element } = routeElement.props;
    const pathParams = matchPath(path, pathname);
    if (pathParams) {
      return (
        <PathParamsContext.Provider value={pathParams}>
          {element}
        </PathParamsContext.Provider>
      );
    }
  }

  return fallback;
}
