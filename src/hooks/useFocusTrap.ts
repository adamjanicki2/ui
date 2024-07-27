import { useEffect, useRef } from "react";

const focusableElementsString =
  'a[href], area[href], input:not([disabled]), select:not([disabled]), textarea:not([disabled]), button:not([disabled]), iframe, object, embed, [tabindex="0"], [contenteditable]';

/**
 * A hook for trapping focus within an element.
 *
 * @param isActive true if the element is active, false otherwise
 * @returns ref object that must be passed to the element that should be trapped
 */
const useFocusTrap = <T extends HTMLElement>(isActive: boolean) => {
  const trapRef = useRef<T | null>(null);

  useEffect(() => {
    if (!isActive || !trapRef.current) return;

    const focusableElements = trapRef.current.querySelectorAll<T>(
      focusableElementsString
    );

    if (!focusableElements.length) return;

    const firstFocusableElement = focusableElements[0];
    const lastFocusableElement =
      focusableElements[focusableElements.length - 1];

    const trapFocus = (event: KeyboardEvent) => {
      if (event.key !== "Tab") return;

      if (event.shiftKey) {
        // Shift + Tab
        if (document.activeElement === firstFocusableElement) {
          lastFocusableElement.focus();
          event.preventDefault();
        }
      } else {
        // Tab
        if (document.activeElement === lastFocusableElement) {
          firstFocusableElement.focus();
          event.preventDefault();
        }
      }
    };

    document.addEventListener("keydown", trapFocus);

    firstFocusableElement.focus();

    return () => {
      document.removeEventListener("keydown", trapFocus);
    };
  }, [isActive]);

  return trapRef;
};

export default useFocusTrap;
