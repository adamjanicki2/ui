import { useCallback } from "react";

/**
 * A hook for scrolling to a hash on the page.
 * @returns a function that scrolls to the hash on the page
 */
const useScrollToHash = () =>
  useCallback(
    /**
     * Scrolls to the hash on the page.
     * @param behavior the behavior of the scroll
     */
    (behavior?: ScrollBehavior) => {
      const hash = window.location.hash;
      if (hash) {
        const element = document.getElementById(hash.substring(1));
        if (element) {
          element.scrollIntoView({ behavior });
        }
      }
    },
    []
  );

export default useScrollToHash;
