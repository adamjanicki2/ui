import { useEffect } from "react";

type UseScrollToHashConfig = {
  /**
   * Whether or not to scroll to the hash.
   * @default true
   */
  active?: boolean;
  /** The scroll behavior to use */
  behavior?: ScrollBehavior;
  /** Delay in ms to set using setTimeout */
  delay?: number;
};

/**
 * A hook for scrolling to a hash on the page.
 *
 * @param config Hook configuration.
 */
const useScrollToHash = (config: UseScrollToHashConfig = {}) => {
  const { active = true, behavior, delay } = config;
  useEffect(() => {
    const hash = window.location.hash;
    if (!active || hash?.length <= 1) return;
    const id = hash.substring(1);
    const scrollToId = () =>
      document.getElementById(id)?.scrollIntoView({ behavior });
    if (delay !== undefined) {
      const timeout = setTimeout(scrollToId, delay);
      return () => clearTimeout(timeout);
    }
    scrollToId();
  }, [active, behavior, delay]);
};

export default useScrollToHash;
