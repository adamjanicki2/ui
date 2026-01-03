import { useEffect } from "react";

let globalLockCount = 0;

const lockScroll = () => {
  globalLockCount += 1;
  if (globalLockCount > 1) {
    return () => {
      globalLockCount -= 1;
    };
  }

  const scrollPosition = window.scrollY;
  const style = document.body.style;
  const { overflow, position, top, width } = style;

  style.overflow = "hidden";
  style.position = "fixed";
  style.top = `-${scrollPosition}px`;
  style.width = "100%";

  return () => {
    globalLockCount -= 1;
    if (globalLockCount > 0) {
      return;
    }

    style.overflow = overflow;
    style.position = position;
    style.top = top;
    style.width = width;

    window.scrollTo({ top: scrollPosition, left: 0, behavior: "instant" });
  };
};

/**
 * Hook to lock and unlock the scroll position on enable change or mount/unmount.
 * @param enable Whether to lock the scroll position, defaults to `true`.
 */
const useScrollLock = (enable = true) => {
  useEffect(() => {
    if (enable) {
      return lockScroll();
    }
  }, [enable]);
};

export default useScrollLock;
