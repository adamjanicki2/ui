import { useEffect } from "react";
import scrollToId from "../functions/scrollToId";

type UseScrollToHashConfig = {
  /**
   * Whether or not to scroll to the hash
   */
  active: boolean;
  /**
   * The scroll behavior to use
   */
  behavior?: ScrollBehavior;
};

/**
 * A hook for scrolling to a hash on the page.
 */
const useScrollToHash = ({
  active,
  behavior = "smooth",
}: UseScrollToHashConfig) => {
  useEffect(() => {
    if (!active) return;

    const hash = window.location.hash;
    if (hash?.length > 1) {
      const id = hash.substring(1);
      scrollToId(id, behavior);
    }
  }, [active, behavior]);
};

export default useScrollToHash;
