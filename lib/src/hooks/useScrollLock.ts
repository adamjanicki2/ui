import { useEffect } from "react";

let lockCount = 0;

type State = {
  scrollY: number;
  overflow: string;
  position: string;
  top: string;
  width: string;
  paddingRight: string;
};

let state: State | null = null;

function acquire() {
  const style = document.body.style;

  const scrollbarWidth =
    window.innerWidth - document.documentElement.clientWidth;

  state = {
    scrollY: window.scrollY,
    overflow: style.overflow,
    position: style.position,
    top: style.top,
    width: style.width,
    paddingRight: style.paddingRight,
  };

  if (scrollbarWidth > 0) {
    style.paddingRight = `calc(${getComputedStyle(document.body).paddingRight || "0px"} + ${scrollbarWidth}px)`;
  }

  style.overflow = "hidden";
  style.position = "fixed";
  style.top = `-${state.scrollY}px`;
  style.width = "100%";
}

function release() {
  if (!state) return;
  const style = document.body.style;

  style.overflow = state.overflow;
  style.position = state.position;
  style.top = state.top;
  style.width = state.width;
  style.paddingRight = state.paddingRight;

  window.scrollTo({ top: state.scrollY, left: 0, behavior: "instant" });

  state = null;
}

const lockScroll = () => {
  lockCount += 1;

  if (lockCount === 1) {
    acquire();
  }

  return () => {
    lockCount -= 1;
    if (lockCount === 0) {
      release();
    }
  };
};

/**
 * Hook to lock and unlock the scroll position on enable change or mount/unmount.
 * @param enable Whether to lock the scroll position, defaults to `true`.
 */
const useScrollLock = (enable = true) => {
  useEffect(() => {
    if (enable) return lockScroll();
  }, [enable]);
};

export default useScrollLock;
