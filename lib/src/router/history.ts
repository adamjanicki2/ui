import type { Location } from "./types";

export function getCurrentLocation(): Location {
  return {
    pathname: window.location.pathname,
    search: window.location.search,
    hash: window.location.hash,
  };
}

type LocationListener = (location: Location) => void;

/**
 * A very small browser history wrapper around the History API.
 */
export function createBrowserHistory() {
  let listeners: LocationListener[] = [];

  const notifyListeners = () => {
    const location = getCurrentLocation();
    listeners.forEach((listener) => listener(location));
  };

  window.addEventListener("popstate", notifyListeners);

  return {
    push(to: string) {
      window.history.pushState(null, "", to);
      notifyListeners();
    },

    addListener(listener: LocationListener) {
      listeners.push(listener);
      return () => {
        listeners = listeners.filter(
          (existingListener) => existingListener !== listener
        );
      };
    },

    cleanup() {
      window.removeEventListener("popstate", notifyListeners);
      listeners = [];
    },
  };
}

export type BrowserHistory = ReturnType<typeof createBrowserHistory>;
