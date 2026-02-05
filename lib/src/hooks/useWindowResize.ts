import useEventListener from "./useEventListener";

/**
 * A hook that listens for window resize events.
 *
 * @param callback The callback function fired when the window is resized.
 */
const useWindowResize = (callback: (event?: UIEvent) => void) => {
  useEventListener({ event: "resize", handler: callback as () => void });
};

export default useWindowResize;
