import { useEffect, useState } from "react";

type Config = {
  /** Callback for when the media query matches */
  onMatch?: () => void;
  /** Callback for when the media query does not match */
  onUnmatch?: () => void;
  /** The media query to watch for */
  query: string;
};

/**
 * A hook for watching media queries.
 *
 * @param config The configuration for the hook.
 * @returns true If the media query matches, false otherwise.
 */
const useMediaQuery = (config: Config): boolean => {
  const { onMatch, onUnmatch, query } = config;
  const [matches, setMatches] = useState(
    () => window.matchMedia(query).matches
  );

  useEffect(() => {
    const mediaQuery = window.matchMedia(query);

    setMatches(mediaQuery.matches);

    const listener = (event: MediaQueryListEvent) => {
      const callback = event.matches ? onMatch : onUnmatch;
      callback?.();
      setMatches(event.matches);
    };

    mediaQuery.addEventListener("change", listener);
    return () => mediaQuery.removeEventListener("change", listener);
  }, [query, onMatch, onUnmatch]);

  return matches;
};
export default useMediaQuery;
