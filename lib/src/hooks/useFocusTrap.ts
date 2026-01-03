import { useEffect, useRef } from "react";

const selector =
  'a[href], area[href], input:not([disabled]), select:not([disabled]), textarea:not([disabled]), button:not([disabled]), iframe, object, embed, [tabindex="0"], [contenteditable]';

/**
 * A hook for trapping focus within an element
 *
 * @param isActive true if the element is active, false otherwise
 * `true` by default
 * @returns ref object that must be passed to the element that should be trapped
 */
const useFocusTrap = <T extends HTMLElement>(isActive = true) => {
  const trapRef = useRef<T | null>(null);

  useEffect(() => {
    const trap = trapRef.current;
    if (!isActive || !trap) return;

    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.key !== "Tab") return;

      const focusableElements = trap.querySelectorAll<HTMLElement>(selector);
      if (!focusableElements.length) {
        event.preventDefault();
        return;
      }

      const first = focusableElements[0];
      const last = focusableElements[focusableElements.length - 1];
      const active = document.activeElement;

      if (event.shiftKey) {
        if (active === first || !trap.contains(active)) {
          last.focus();
          event.preventDefault();
        }
      } else {
        if (active === last || !trap.contains(active)) {
          first.focus();
          event.preventDefault();
        }
      }
    };

    trap.addEventListener("keydown", handleKeyDown, true);

    return () => {
      trap.removeEventListener("keydown", handleKeyDown, true);
    };
  }, [isActive]);

  return trapRef;
};

export default useFocusTrap;
