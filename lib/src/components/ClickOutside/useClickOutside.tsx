import { useCallback, useEffect, useRef } from "react";
import type { ReadonlyableArray } from "../../types/common";

export type EventType =
  | "click"
  | "mousedown"
  | "mouseup"
  | "pointerdown"
  | "pointerup";

type Target = Element | null | undefined;

type Config = {
  /** Element(s) to treat as the "inside" boundary */
  targets: ReadonlyableArray<Target>;
  /** Callback fired when an event occurs outside all targets */
  onClickOutside: (event: MouseEvent | PointerEvent) => void;
  /**
   * Document event type to listen for.
   * @default "click"
   */
  eventType?: EventType;
  /**
   * Whether the listener is enabled.
   * @default true
   */
  enabled?: boolean;
};

function isInside(event: Event, element: Target) {
  if (!element) return false;
  const target = event.target as Node | null;
  if (!target) return false;
  const path = event.composedPath?.() || [];
  return path.includes(element) || element.contains(target);
}

/**
 * Fire a callback when an event occurs outside all targets.
 * This does not add any DOM; it relies on a provided list of elements.
 */
const useClickOutside = (config: Config) => {
  const {
    targets,
    onClickOutside,
    eventType = "click",
    enabled = true,
  } = config;

  const startedRef = useRef(false);

  useEffect(() => {
    const timeout = window.setTimeout(() => {
      startedRef.current = true;
    }, 0);

    return () => {
      clearTimeout(timeout);
      startedRef.current = false;
    };
  }, []);

  const handleEvent = useCallback(
    (event: MouseEvent | PointerEvent) => {
      if (!enabled || !startedRef.current) return;
      const insideTarget = targets.some((el) => isInside(event, el));
      if (insideTarget) return;

      onClickOutside(event);
    },
    [enabled, onClickOutside, targets]
  );

  useEffect(() => {
    if (!enabled) return;
    document.addEventListener(eventType, handleEvent);
    return () => document.removeEventListener(eventType, handleEvent);
  }, [enabled, handleEvent, eventType]);
};

export default useClickOutside;
