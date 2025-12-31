import React from "react";
import RouterContext from "./RouterContext";

export default function useRouterContext(name: string) {
  const routerContext = React.useContext(RouterContext);
  if (!routerContext) {
    throw new Error(`${name} must be used inside of a <Router> component`);
  }

  return routerContext;
}
