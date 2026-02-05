import { useEffect } from "react";

type UseEventListenerConfig<E extends keyof WindowEventMap> = {
  event: E;
  handler: (event: WindowEventMap[E]) => void;
  target?: Window | Document | HTMLElement;
  options?: boolean | AddEventListenerOptions;
};

const useEventListener = <E extends keyof WindowEventMap>({
  event,
  handler,
  target = window,
  options,
}: UseEventListenerConfig<E>) => {
  useEffect(() => {
    target.addEventListener(event, handler as EventListener, options);
    return () =>
      target.removeEventListener(event, handler as EventListener, options);
  }, [event, handler, target, options]);
};

export default useEventListener;
