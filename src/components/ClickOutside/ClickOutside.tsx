import { cloneElement, useEffect, useRef } from "react";
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
  const ref = useRef<HTMLElement | null>(null);
  const bubbledRef = useRef(false);
  const startedRef = useRef(false);

  useEffect(() => {
    // Set startedRef after the current synchronous code has executed
    const timeoutId = setTimeout(() => {
      startedRef.current = true;
    }, 0);

    const handleClickOutside = (event: MouseEvent) => {
      const bubbledUp = bubbledRef.current;
      bubbledRef.current = false;

      if (!startedRef.current || !ref.current || bubbledUp) return;

      const isOnEventPath = event.composedPath().includes(ref.current);
      if (!isOnEventPath) {
        onClickOutside(event);
      }
    };

    document.addEventListener("click", handleClickOutside);

    return () => {
      clearTimeout(timeoutId);
      startedRef.current = false;
      document.removeEventListener("click", handleClickOutside);
    };
  }, [onClickOutside]);

  return cloneElement(children, {
    ref,
    onClick: (event: SyntheticEvent) => {
      bubbledRef.current = true;
      children.props.onClick?.(event);
    },
  });
};

export default ClickOutside;
