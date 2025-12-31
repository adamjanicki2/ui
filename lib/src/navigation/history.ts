import type { Location, HistoryMode } from "../types/navigation";

export function getCurrentLocation(): Location {
  return {
    pathname: window.location.pathname,
    search: window.location.search,
    hash: window.location.hash,
  };
}

type LocationListener = (location: Location) => void;

export function createHistory() {
  const listeners = new Set<LocationListener>();

  const notifyListeners = () => {
    const location = getCurrentLocation();
    listeners.forEach((listener) => listener(location));
  };

  let listening = false;

  const startListening = () => {
    if (listening) return;
    window.addEventListener("popstate", notifyListeners);
    listening = true;
  };

  const stopListening = () => {
    if (!listening) return;
    window.removeEventListener("popstate", notifyListeners);
    listening = false;
  };

  return {
    update(to: string, mode: HistoryMode = "push") {
      window.history[`${mode}State`](null, "", to);
      notifyListeners();
    },

    addListener(listener: LocationListener) {
      startListening();
      listeners.add(listener);

      return () => {
        listeners.delete(listener);
        if (listeners.size === 0) stopListening();
      };
    },

    cleanup() {
      stopListening();
      listeners.clear();
    },
  } as const;
}

export type History = ReturnType<typeof createHistory>;
