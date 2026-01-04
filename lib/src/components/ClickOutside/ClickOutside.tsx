import React, { cloneElement, useState } from "react";
import useMergeRefs from "../../hooks/useMergeRefs";
import useClickOutside, {
  type EventType,
  type EventTypes,
} from "./useClickOutside";

type Props<T extends EventType> = {
  /**
   * The children to render.
   * IMPORTANT: The child must be a single element which can hold a ref.
   */
  children: React.ReactElement<any>;
  /**
   * The function to call when a click occurs outside the child element.
   *
   * @param event The mouse event object.
   */
  onClickOutside: (event: EventTypes[T]) => void;
  /**
   * The mouse event to trigger on.
   * @default "click"
   */
  mouseEvent?: T;
};

/** Fire a callback when a click occurs outside the child target */
const ClickOutside = <T extends EventType = "click">(
  props: Props<T>
): React.JSX.Element => {
  const { children, onClickOutside, mouseEvent = "click" } = props;
  const [element, setElement] = useState<Element | null>(null);

  useClickOutside({
    targets: [element],
    onClickOutside,
    eventType: mouseEvent as T,
  });

  const mergedRef = useMergeRefs<HTMLElement>(setElement, children.props.ref);

  return cloneElement(children, {
    ref: mergedRef,
  });
};

export default ClickOutside;
