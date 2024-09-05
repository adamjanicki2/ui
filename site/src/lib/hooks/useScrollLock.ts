import { useEffect } from "react";

const lockScroll = () => {
  const scrollPosition = window.scrollY;
  const style = document.body.style;
  const htmlStyle = document.documentElement.style;
  const { overflow, position, top, width } = style;
  const { scrollBehavior } = htmlStyle;

  htmlStyle.scrollBehavior = "auto";
  style.overflow = "hidden";
  style.position = "fixed";
  style.top = `-${scrollPosition}px`;
  style.width = "100%";

  return () => {
    style.overflow = overflow;
    style.position = position;
    style.top = top;
    style.width = width;
    // Restore scroll position without smooth behavior
    window.scrollTo(0, scrollPosition);
    htmlStyle.scrollBehavior = scrollBehavior;
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
