import { useEffect } from "react";

/**
 * A hook that listens for window resize events.
 *
 * @param callback the callback function fired when the window is resized.
 */
const useWindowResize = (callback: (event?: UIEvent) => void) => {
  useEffect(() => {
    window.addEventListener("resize", callback);
    return () => window.removeEventListener("resize", callback);
  }, [callback]);
};

export default useWindowResize;
