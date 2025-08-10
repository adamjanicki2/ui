import { useEffect, useState } from "react";

/**
 * A hook getting the current scroll position of the window.
 * @returns an object containing the current scroll position of the window.
 */
const useScroll = (): { scrollX: number; scrollY: number } => {
  const [scroll, setScroll] = useState({
    scrollX: window.scrollX,
    scrollY: window.scrollY,
  });

  useEffect(() => {
    const onScroll = () => {
      setScroll({
        scrollX: window.scrollX,
        scrollY: window.scrollY,
      });
    };
    window.addEventListener("scroll", onScroll);
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  return scroll;
};

export default useScroll;
