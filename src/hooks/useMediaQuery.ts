import { useEffect, useState } from "react";

type Config = {
  /**
   * Callback for when the media query matches.
   */
  onMatch?: () => void;
  /**
   * Callback for when the media query does not match.
   */
  onUnmatch?: () => void;
  /**
   * The media query to watch for.
   * @example "(max-width: 768px)"
   */
  query: string;
};

/**
 * A hook for watching media queries.
 *
 * @param config the configuration for the hook
 * @returns true if the media query matches, false otherwise
 */
const useMediaQuery = (config: Config): boolean => {
  const { onMatch, onUnmatch, query } = config;
  const [matches, setMatches] = useState(false);

  useEffect(() => {
    const mediaQuery = window.matchMedia(query);
    const listener = (event: MediaQueryListEvent) => {
      if (event.matches) {
        onMatch?.();
      } else {
        onUnmatch?.();
      }
      setMatches(event.matches);
    };
    mediaQuery.addEventListener("change", listener);
    setMatches(mediaQuery.matches);
    return () => mediaQuery.removeEventListener("change", listener);
  }, [onMatch, onUnmatch, query]);

  return matches;
};
export default useMediaQuery;
