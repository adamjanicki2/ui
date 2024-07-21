import { useCallback } from "react";

type ScrollLock = {
  /**
   * Callback function to lock the scroll position
   */
  lock: () => void;
  /**
   * Callback function to unlock the scroll position
   */
  unlock: () => void;
};

/**
 * Hook to lock and unlock the scroll position
 * @returns Object with lock and unlock functions to lock and unlock the scroll position
 */
const useScrollLock = (): ScrollLock => {
  const lock = useCallback(() => {
    const scrollPosition = window.scrollY;

    document.body.style.overflow = "hidden";
    document.body.style.position = "fixed";
    document.body.style.top = `-${scrollPosition}px`;
    document.body.style.width = "100%";
  }, []);

  const unlock = useCallback(() => {
    const scrollPosition = parseInt(document.body.style.top || "0", 10);

    document.body.style.overflow = "";
    document.body.style.position = "";
    document.body.style.top = "";
    document.body.style.width = "";

    window.scrollTo(0, -scrollPosition);
  }, []);

  return { lock, unlock };
};

export default useScrollLock;
