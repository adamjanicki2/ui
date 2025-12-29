import React from "react";
import { matchPath } from "./path";
import PathParamsContext from "./PathParamsContext";
import Route, { type Props as RouteProps } from "./Route";
import { Children, ReadonlyableArray } from "../utils/types";
import { useRouterContext } from "./hooks";
import { stripBasename } from "./href";

export type Props = {
  /** Only <Route /> children are supported */
  children: Children;
};

function findRouteElements(children: ReadonlyableArray<React.ReactNode>) {
  return children.filter(
    (child) => React.isValidElement(child) && child.type === Route
  ) as React.ReactElement<RouteProps, typeof Route>[];
}

/**
 * Nested within a router component, this component handles rendering the proper route.
 * Note: sticking any other components besides routes in here will not be rendered
 */
export default function Routes({ children: rawChildren }: Props) {
  const router = useRouterContext("<Routes>");
  const { location, basename } = router;
  console.log({ locationPath: location.pathname, basename });
  const pathname = stripBasename(location.pathname, basename);

  const children = Array.isArray(rawChildren) ? rawChildren : [rawChildren];

  const routes = findRouteElements(children);

  for (const routeElement of routes) {
    const { path, element } = routeElement.props;
    console.log({ path, pathname });
    const pathParams = matchPath(path, pathname);
    if (pathParams) {
      return (
        <PathParamsContext.Provider value={pathParams}>
          {element}
        </PathParamsContext.Provider>
      );
    }
  }

  return null;
}
