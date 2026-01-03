import React from "react";
import RouterContext from "./RouterContext";
import { createHistory, getCurrentLocation, type History } from "./history";
import type { Location, Navigate, NavigateOptions } from "../types/navigation";
import { getHref, normalizeBasename } from "./href";

export type Props = {
  /** Children to render inside the router provider */
  children: React.ReactNode;
  /** Optional basename prefix for all internal navigation (eg "/app") */
  basename?: string;
  /**
   * Whether to maintain current page scroll height on navigate
   * @default false
   */
  maintainScrollHeight?: boolean;
};

export default function Router({
  children,
  basename,
  maintainScrollHeight,
}: Props) {
  basename = normalizeBasename(basename ?? "");
  const historyRef = React.useRef<History | null>(null);
  if (!historyRef.current) historyRef.current = createHistory();
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

  const navigate: Navigate = React.useCallback(
    (to: string | number, options?: NavigateOptions) => {
      if (typeof to === "number") {
        history.go(to);
        return;
      }

      const { url } = getHref(to, locationRef.current.pathname, basename);
      history.update(url, options?.historyMode);

      if (!maintainScrollHeight) {
        window.scrollTo({ top: 0, left: 0, behavior: "instant" });
      }
    },
    [history, basename, maintainScrollHeight]
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
