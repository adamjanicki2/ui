import React from "react";
import { RouterContext } from "./context";
import {
  createBrowserHistory,
  getCurrentLocation,
  type BrowserHistory,
} from "./history";
import type { Location, Navigate } from "./types";
import { getHref } from "./href";

export type Props = {
  /** Children to render inside the router provider */
  children: React.ReactNode;
  /** Optional basename prefix for all internal navigation (e.g. "/app") */
  basename?: string;
};

export default function Router({ children, basename = "" }: Props) {
  const historyRef = React.useRef<BrowserHistory | null>(null);
  if (!historyRef.current) historyRef.current = createBrowserHistory();
  const history = historyRef.current;

  const [location, setLocation] = React.useState<Location>(getCurrentLocation);

  // to avoid infinite rerenders
  const locationRef = React.useRef<Location>(location);

  React.useLayoutEffect(() => {
    const removeListener = history.addListener((nextLocation) => {
      locationRef.current = nextLocation;
      setLocation(nextLocation);
    });

    return () => {
      removeListener();
      history.cleanup();
    };
  }, [history]);

  const navigate = React.useCallback<Navigate>(
    (to) => {
      const currentPathname = locationRef.current.pathname;
      history.push(getHref(to, currentPathname, basename).url);
    },
    [history, basename]
  );

  const contextValue = React.useMemo(
    () => ({
      location,
      navigate,
      basename,
    }),
    [location, navigate, basename]
  );

  return (
    <RouterContext.Provider value={contextValue}>
      {children}
    </RouterContext.Provider>
  );
}
