import React, { cloneElement, useCallback, useEffect, useRef } from "react";

type Props<T extends React.ElementType> = {
  /**
   * The children to render.
   * IMPORTANT: The child must be a single element which can hold a ref.
   */
  children: React.ReactElement<React.ComponentPropsWithRef<T>>;
  /**
   * The function to call when a click occurs outside the child element.
   *
   * @param event - The mouse event object
   */
  onClickOutside: (event: MouseEvent) => void;
};

const ClickOutside = <T extends React.ElementType>({
  children,
  onClickOutside,
}: Props<T>): React.JSX.Element => {
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

      if (!startedRef.current || !ref.current || clickedWithinChild) return;

      if (!event.composedPath().includes(ref.current)) {
        onClickOutside(event);
      }
    },
    [onClickOutside]
  );

  useEffect(() => {
    document.addEventListener("click", handleClickOutside);
    return () => document.removeEventListener("click", handleClickOutside);
  }, [handleClickOutside]);

  return cloneElement(children, {
    ref,
    onClick: (event: React.SyntheticEvent) => {
      // point of this is to let us know that click originated
      // from the child element, so we can ignore it if the click ends outside
      clickWithinChildRef.current = true;
      children.props?.onClick?.(event);
    },
  } as any);
};

export default ClickOutside;
