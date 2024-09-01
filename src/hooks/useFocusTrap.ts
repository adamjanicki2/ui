import { useEffect, useRef, useState } from "react";

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
  const [currentIndex, setCurrentIndex] = useState<number | undefined>(
    undefined
  );

  useEffect(() => {
    if (!isActive || !trapRef.current) return;

    const focusableElements = trapRef.current.querySelectorAll<T>(
      focusableElementsString
    );

    const trapFocus = (event: KeyboardEvent) => {
      if (event.key !== "Tab") return;

      event.preventDefault();

      if (focusableElements.length === 0) return;

      let newIndex = currentIndex;

      if (event.shiftKey) {
        // Shift + Tab
        newIndex =
          ((currentIndex ?? 0) - 1 + focusableElements.length) %
          focusableElements.length;
      } else {
        // Tab
        newIndex = ((currentIndex ?? -1) + 1) % focusableElements.length;
      }

      focusableElements[newIndex]?.focus();
      setCurrentIndex(newIndex);
    };

    document.addEventListener("keydown", trapFocus);
    return () => {
      document.removeEventListener("keydown", trapFocus);
    };
  }, [isActive, currentIndex]);

  return trapRef;
};

export default useFocusTrap;
