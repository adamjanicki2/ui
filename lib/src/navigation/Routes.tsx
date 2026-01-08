import React from "react";

import type { Children } from "../types/common";
import { stripBasename } from "./href";
import { matchPath } from "./path";
import PathParamsContext from "./PathParamsContext";
import Route, { type Props as RouteProps } from "./Route";
import useRouterContext from "./useRouterContext";

export type Props = {
  /**
   * Child <Route> elements to switch between.
   * Note: non <Route> children will be silently ignored.
   */
  children: Children;
  /** What to render when no routes match, like a 404 page */
  fallback?: React.ReactNode;
};

type RouteElement = React.ReactElement<RouteProps, typeof Route>;

function findRouteElements(children: React.ReactNode) {
  let routeElements: RouteElement[] = [];

  React.Children.forEach(children, (child) => {
    if (React.isValidElement(child)) {
      if (child.type === Route) {
        routeElements.push(child as RouteElement);
      } else {
        const props = child.props as { children?: React.ReactNode };
        routeElements = routeElements.concat(findRouteElements(props.children));
      }
    }
  });

  return routeElements;
}

/**
 * Nested within a router component, this component handles rendering the proper route.
 * Note: sticking any other components besides routes in here will not be rendered.
 */
export default function Routes({ children, fallback }: Props): React.ReactNode {
  const router = useRouterContext("<Routes>");
  const { location, basename } = router;
  const pathname = stripBasename(location.pathname, basename);

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
