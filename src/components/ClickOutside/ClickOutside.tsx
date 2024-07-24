import { cloneElement, useCallback, useEffect, useRef } from "react";
import type { ReactElement, SyntheticEvent } from "react";

type Props = {
  /**
   * The children to render.
   * IMPORTANT: The child must be a single element which can hold a ref.
   */
  children: ReactElement;
  /**
   * The function to call when a click occurs outside the child element.
   *
   * @param event - The mouse event object
   */
  onClickOutside: (event: MouseEvent) => void;
};

const ClickOutside = ({ children, onClickOutside }: Props): JSX.Element => {
  const ref = useRef<HTMLElement>();
  const bubbledRef = useRef(false);
  const startedRef = useRef(false);

  useEffect(() => {
    setTimeout(() => {
      startedRef.current = true;
    }, 0);
    return () => {
      startedRef.current = false;
    };
  }, []);

  const handleClickOutside = useCallback(
    (event: MouseEvent) => {
      const bubbledUp = bubbledRef.current;
      bubbledRef.current = false;

      if (!startedRef.current || !ref.current || bubbledUp) return;

      const isOnEventPath = event.composedPath().includes(ref.current);
      !isOnEventPath && onClickOutside(event);
    },
    [onClickOutside]
  );

  useEffect(() => {
    document.addEventListener("click", handleClickOutside);
    return () => document.removeEventListener("click", handleClickOutside);
  }, [handleClickOutside]);

  return cloneElement(children, {
    ref,
    onClick: (event: SyntheticEvent) => {
      // point of this is to let us know that click bubbled up
      // from the child element, so we can ignore it if it
      // happens on the element itself
      bubbledRef.current = true;
      children.props.onClick?.(event);
    },
  });
};

export default ClickOutside;
