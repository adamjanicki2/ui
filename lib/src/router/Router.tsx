import React from "react";
import { RouterContext } from "./context";
import {
  createBrowserHistory,
  getCurrentLocation,
  type BrowserHistory,
} from "./history";
import type { Location, Navigate } from "./types";

export type Props = {
  /** Children to render inside the router provider */
  children: React.ReactNode;
  /** Optional basename prefix for all internal navigation (e.g. "/app") */
  basename?: string;
};

// formats with a starting slash and removes trailing slash
function normalizeBasename(basename?: string) {
  if (!basename) return undefined;
  basename = basename.endsWith("/") ? basename.slice(0, -1) : basename;
  basename = basename.startsWith("/") ? basename : `/${basename}`;
  return basename;
}

function getTo(to: string, pathname: string, basename?: string) {
  basename ||= "";
  // Absolute
  if (to.startsWith("/")) {
    return basename + to;
  }

  // Relative (we assume the invariant that pathname already contains basename)
  pathname = pathname.endsWith("/") ? pathname : pathname + "/";
  return pathname + to;
}

export default function Router({ children, basename }: Props) {
  basename = normalizeBasename(basename);

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
  }, []);

  const navigate = React.useCallback<Navigate>(
    (to) => {
      const currentPathname = locationRef.current.pathname;
      history.push(getTo(to, currentPathname, basename));
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
