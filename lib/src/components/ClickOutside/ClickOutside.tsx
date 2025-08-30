import React, { cloneElement, useCallback, useEffect, useRef } from "react";
import useMergeRefs from "../../hooks/useMergeRefs";

const mouseEvents = {
  click: "onClick",
  mousedown: "onMouseDown",
  mouseup: "onMouseUp",
} as const;

type Props = {
  /**
   * The children to render.
   * IMPORTANT: The child must be a single element which can hold a ref.
   */
  children: React.ReactElement<any>;
  /**
   * The function to call when a click occurs outside the child element.
   *
   * @param event - The mouse event object
   */
  onClickOutside: (event: MouseEvent) => void;
  /**
   * The mouse event to trigger on
   * @default "click"
   */
  mouseEvent?: keyof typeof mouseEvents;
  /**
   * Additional elements to ignore
   */
  ignoreElements?: (HTMLElement | null)[];
};

const ClickOutside = ({
  children,
  onClickOutside,
  ignoreElements = [],
  mouseEvent = "click",
}: Props): React.JSX.Element => {
  const ref = useRef<Element | null>(null);
  const clickWithinChildRef = useRef(false);
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

  const handleClickOutside = useCallback(
    (event: MouseEvent) => {
      const clickedWithinChild = clickWithinChildRef.current;
      clickWithinChildRef.current = false;

      const childElement = ref.current;

      if (!startedRef.current || !childElement || clickedWithinChild) return;

      const isInside = isClickInsideElements(
        event,
        childElement,
        ...ignoreElements
      );

      if (!isInside) {
        onClickOutside(event);
      }
    },
    [onClickOutside, ignoreElements]
  );

  useEffect(() => {
    document.addEventListener(mouseEvent, handleClickOutside);
    return () => document.removeEventListener(mouseEvent, handleClickOutside);
  }, [handleClickOutside, mouseEvent]);

  const mergedRef = useMergeRefs(ref, children.props.ref);
  const mouseEventPropName = mouseEvents[mouseEvent];

  return cloneElement(children, {
    ref: mergedRef,
    [mouseEventPropName]: (event: React.SyntheticEvent) => {
      // point of this is to let us know that click originated
      // from the child element, so we can ignore it
      clickWithinChildRef.current = true;
      children.props?.[mouseEventPropName]?.(event);
    },
  });
};

function isClickInsideElements(
  event: MouseEvent,
  ...elements: (HTMLElement | Element | null)[]
) {
  const path = event.composedPath?.() || [];

  return elements.some(
    (el) => el && (path.includes(el) || el.contains(event.target as Node))
  );
}

export default ClickOutside;
