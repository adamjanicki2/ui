import { useEffect, useRef } from "react";

const selector =
  'a[href], area[href], input:not([disabled]), select:not([disabled]), textarea:not([disabled]), button:not([disabled]), iframe, object, embed, [contenteditable], [tabindex]:not([tabindex="-1"])';

const traps: HTMLElement[] = [];

// computes the trapElement containing the active element that is lowest (closest to leaves) in the DOM tree
function youngestTrap(activeEl: HTMLElement | null): HTMLElement | undefined {
  if (!activeEl || traps.length === 1) return traps[traps.length - 1];

  const containing = traps.filter((trap) => trap.contains(activeEl));
  if (containing.length <= 0) return traps[traps.length - 1];

  // containing a node means that node is a descendant
  return containing.reduce((acc, cur) => (acc.contains(cur) ? cur : acc));
}

/**
 * A hook for trapping focus within an element.
 *
 * @param active Whether the trap is active, defaults to `true`.
 * @returns Ref object that must be passed to the element that should be trapped.
 */
const useFocusTrap = <T extends HTMLElement>(active = true) => {
  const trapRef = useRef<T | null>(null);

  useEffect(() => {
    const trap = trapRef.current;
    if (!active || !trap) return;

    traps.push(trap);

    const handleKeyDown = (event: KeyboardEvent) => {
      const activeEl = document.activeElement as HTMLElement | null;
      if (event.key !== "Tab" || youngestTrap(activeEl) !== trap) return;

      const focusableElements = trap.querySelectorAll<HTMLElement>(selector);
      if (focusableElements.length <= 0) {
        event.preventDefault();
        return;
      }

      const first = focusableElements[0];
      const last = focusableElements[focusableElements.length - 1];

      if (event.shiftKey) {
        if (activeEl === first || !active || !trap.contains(activeEl)) {
          last.focus();
          event.preventDefault();
        }
      } else {
        if (activeEl === last || !active || !trap.contains(activeEl)) {
          first.focus();
          event.preventDefault();
        }
      }
    };

    trap.addEventListener("keydown", handleKeyDown, true);

    return () => {
      trap.removeEventListener("keydown", handleKeyDown, true);

      const index = traps.lastIndexOf(trap);
      if (index >= 0) traps.splice(index, 1);
    };
  }, [active]);

  return trapRef;
};

export default useFocusTrap;
