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

function applyBasename(to: string, basename?: string) {
  if (!basename) return to;

  // Support "settings" or "/settings".
  if (to.startsWith("/")) return `${basename}${to}`;
  return `${basename}/${to}`;
}

export default function Router({ children, basename }: Props) {
  const historyRef = React.useRef<BrowserHistory | null>(null);
  if (!historyRef.current) historyRef.current = createBrowserHistory();
  const history = historyRef.current;

  const normalizedBasename = normalizeBasename(basename);

  const [location, setLocation] = React.useState<Location>(getCurrentLocation);

  React.useEffect(() => {
    const remove = history.addListener(setLocation);
    return () => {
      remove();
      history.cleanup();
    };
  }, []);

  const navigate = React.useCallback<Navigate>(
    (to) => history.push(applyBasename(to, normalizedBasename)),
    [history, normalizedBasename]
  );

  const contextValue = React.useMemo(
    () => ({
      location,
      navigate,
      basename: normalizedBasename,
    }),
    [location, navigate, normalizedBasename]
  );

  return (
    <RouterContext.Provider value={contextValue}>
      {children}
    </RouterContext.Provider>
  );
}
