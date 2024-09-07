import { useEffect } from "react";
import scrollToId from "../functions/scrollToId";

type UseScrollToHashConfig = {
  /**
   * Whether or not to scroll to the hash
   * @default true
   */
  active?: boolean;
  /**
   * The scroll behavior to use
   */
  behavior?: ScrollBehavior;
  /**
   * Delay in ms to set using setTimeout
   */
  delay?: number;
};

/**
 * A hook for scrolling to a hash on the page.
 */
const useScrollToHash = (config: UseScrollToHashConfig = {}) => {
  const { active = true, behavior, delay } = config;
  useEffect(() => {
    const hash = window.location.hash;
    if (!active || hash?.length <= 1) return;
    const id = hash.substring(1);
    scrollToId(id, behavior);
    if (delay !== undefined) {
      const timeout = setTimeout(() => scrollToId(id, behavior), delay);
      return () => clearTimeout(timeout);
    }
    scrollToId(id, behavior);
  }, [active, behavior, delay]);
};

export default useScrollToHash;
