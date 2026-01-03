import React from "react";
import RouterContext from "./RouterContext";
import {
  createRouterHistory,
  getCurrentLocation,
  type RouterHistory,
} from "./history";
import type { Location, Navigate, NavigateOptions } from "../types/navigation";
import { getHref, normalizeBasename } from "./href";

export type Props = {
  /** Children to render inside the router provider */
  children: React.ReactNode;
  /**
   * Optional basename prefix for all internal navigation.
   * @example "/app"
   */
  basename?: string;
  /**
   * Whether to maintain current page scroll height on navigate.
   * By default, when navigating to a different pathname, the page will reset to top.
   * @default false
   */
  maintainScrollHeight?: boolean;
};

/**
 * Router provider for navigation hooks and components.
 */
export default function Router({
  children,
  basename,
  maintainScrollHeight,
}: Props) {
  basename = normalizeBasename(basename ?? "");
  const historyRef = React.useRef<RouterHistory | null>(null);
  if (!historyRef.current) historyRef.current = createRouterHistory();
  const history = historyRef.current;

  const [location, setLocation] = React.useState<Location>(getCurrentLocation);

  const locationRef = React.useRef<Location>(location);
  const prevPathnameRef = React.useRef(location.pathname);
  const prevScrollRestorationRef = React.useRef<
    History["scrollRestoration"] | null
  >(null);

  const cleanupScrollRestoration = React.useCallback(() => {
    const prev = prevScrollRestorationRef.current;
    if (prev !== null) {
      window.history.scrollRestoration = prev;
      prevScrollRestorationRef.current = null;
    }
  }, []);

  // effect for managing listeners
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

  // effect for scrolling to top
  React.useLayoutEffect(() => {
    const prevPathname = prevPathnameRef.current;
    const nextPathname = location.pathname;

    prevPathnameRef.current = nextPathname;

    if (maintainScrollHeight) {
      cleanupScrollRestoration();
      return;
    }

    if (prevScrollRestorationRef.current === null) {
      prevScrollRestorationRef.current = window.history.scrollRestoration;
    }
    window.history.scrollRestoration = "manual";

    if (prevPathname !== nextPathname) {
      window.scrollTo({ top: 0, left: 0, behavior: "instant" });
    }

    return cleanupScrollRestoration;
  }, [location.pathname, maintainScrollHeight, cleanupScrollRestoration]);

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
