import { useEffect } from "react";

/**
 * A hook for watching the window scroll.
 *
 * @param onScroll the callback for when the window is scrolled
 */
const useWatchScroll = (onScroll: () => void): void => {
  useEffect(() => {
    window.addEventListener("scroll", onScroll);
    return () => window.removeEventListener("scroll", onScroll);
  }, [onScroll]);
};

export default useWatchScroll;
