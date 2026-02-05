import { useState } from "react";

import useEventListener from "./useEventListener";

/**
 * A hook getting the current scroll position of the window.
 * @returns an Object containing the current scroll position of the window.
 */
const useScroll = (): { scrollX: number; scrollY: number } => {
  const [scroll, setScroll] = useState({
    scrollX: window.scrollX,
    scrollY: window.scrollY,
  });

  const onScroll = () => {
    setScroll({
      scrollX: window.scrollX,
      scrollY: window.scrollY,
    });
  };

  useEventListener({ event: "scroll", handler: onScroll });

  return scroll;
};

export default useScroll;
