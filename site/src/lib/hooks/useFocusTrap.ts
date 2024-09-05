import { useEffect, useRef, useCallback } from "react";

const selector =
  'a[href], area[href], input:not([disabled]), select:not([disabled]), textarea:not([disabled]), button:not([disabled]), iframe, object, embed, [tabindex="0"], [contenteditable]';

/**
 * A hook for trapping focus within an element.
 *
 * @param isActive true if the element is active, false otherwise
 * `true` by default
 * @returns ref object that must be passed to the element that should be trapped
 */
const useFocusTrap = <T extends HTMLElement>(isActive = true) => {
  const trapRef = useRef<T | null>(null);
  const focusableElements = useRef<NodeListOf<T> | null>(null);

  const updateFocusableElements = useCallback(() => {
    if (trapRef.current) {
      focusableElements.current = trapRef.current.querySelectorAll<T>(selector);
    }
  }, []);

  useEffect(() => {
    if (!isActive || !trapRef.current) return;

    updateFocusableElements();

    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.key !== "Tab") return;
      if (
        !focusableElements.current ||
        focusableElements.current.length === 0
      ) {
        return event.preventDefault();
      }

      const { activeElement } = document;
      const firstEl = focusableElements.current[0];
      const lastEl =
        focusableElements.current[focusableElements.current.length - 1];

      if (event.shiftKey && activeElement === firstEl) {
        lastEl.focus();
        event.preventDefault();
      } else if (!event.shiftKey && activeElement === lastEl) {
        firstEl.focus();
        event.preventDefault();
      } else if (!trapRef.current?.contains(activeElement as Node)) {
        (event.shiftKey ? lastEl : firstEl).focus();
        event.preventDefault();
      }
    };

    const observer = new MutationObserver(updateFocusableElements);
    observer.observe(trapRef.current, { childList: true, subtree: true });

    document.addEventListener("keydown", handleKeyDown);

    return () => {
      document.removeEventListener("keydown", handleKeyDown);
      observer.disconnect();
    };
  }, [isActive, updateFocusableElements]);

  return trapRef;
};

export default useFocusTrap;
