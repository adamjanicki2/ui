import React from "react";

import type { Location, Navigate, NavigateOptions } from "../types/navigation";
import {
  createRouterHistory,
  getCurrentLocation,
  type RouterHistory,
} from "./history";
import { getHref, normalizeBasename, stripBasename } from "./href";
import RouterContext from "./RouterContext";

export type Props = {
  /**
   * Optional basename prefix for all internal navigation.
   * @example "/app"
   */
  basename?: string;
  /** Children to render inside the router provider */
  children: React.ReactNode;
  /**
   * Whether to reset the page scroll position to the top on navigation.
   * This applies when navigating to a different pathname (query/hash changes do not reset scroll).
   * When enabled, this also sets `history.scrollRestoration = "manual"` to avoid browser scroll
   * restoration fighting the instant scroll.
   * @default true
   */
  resetScroll?: boolean;
};

type ScrollState = {
  prevPathname: string;
  scrollRestoration: History["scrollRestoration"] | null;
};

/**
 * Router provider for navigation hooks and components.
 */
export default function Router({
  children,
  basename,
  resetScroll = true,
}: Props) {
  basename = normalizeBasename(basename ?? "");
  const historyRef = React.useRef<RouterHistory | null>(null);
  if (!historyRef.current) historyRef.current = createRouterHistory();
  const history = historyRef.current;

  const [location, setLocation] = React.useState<Location>(() =>
    getCurrentLocation(basename)
  );

  const locationRef = React.useRef<Location>(location);
  const scrollStateRef = React.useRef<ScrollState>({
    prevPathname: location.pathname,
    scrollRestoration: null,
  });

  React.useLayoutEffect(() => {
    const removeListener = history.addListener((loc) => {
      const nextLocation = {
        ...loc,
        pathname: stripBasename(loc.pathname, basename),
      };
      locationRef.current = nextLocation;
      setLocation(nextLocation);
    });

    // Scroll restoration logic
    const state = scrollStateRef.current;
    if (resetScroll) {
      if (state.scrollRestoration === null) {
        state.scrollRestoration = window.history.scrollRestoration;
      }
      window.history.scrollRestoration = "manual";

      if (state.prevPathname !== location.pathname) {
        window.scrollTo({ top: 0, left: 0, behavior: "instant" });
        state.prevPathname = location.pathname;
      }
    }

    return () => {
      removeListener();
      history.cleanup();
      if (state.scrollRestoration !== null) {
        window.history.scrollRestoration = state.scrollRestoration;
        state.scrollRestoration = null;
      }
    };
  }, [history, location.pathname, resetScroll, basename]);

  const navigate: Navigate = React.useCallback(
    (to: string | number, options?: NavigateOptions) => {
      if (typeof to === "number") {
        history.go(to);
      } else {
        const { url } = getHref(to, locationRef.current.pathname, basename);
        history.update(url, options?.historyMode);
      }
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
