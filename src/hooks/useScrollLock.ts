import { useEffect } from "react";

const lockScroll = () => {
  const scrollPosition = window.scrollY;
  const style = document.body.style;

  const { overflow, position, top, width } = style;

  style.overflow = "hidden";
  style.position = "fixed";
  style.top = `-${scrollPosition}px`;
  style.width = "100%";

  return () => {
    style.overflow = overflow;
    style.position = position;
    style.top = top;
    style.width = width;
    window.scrollTo(0, scrollPosition);
  };
};

/**
 * Hook to lock and unlock the scroll position on enable change or mount/unmount.
 * @param enable whether to lock the scroll position. Defaults to `true`. Useful for using in something that stays mounted.
 */
const useScrollLock = (enable = true) => {
  useEffect(() => {
    if (enable) {
      return lockScroll();
    }
  }, [enable]);
};

export default useScrollLock;
