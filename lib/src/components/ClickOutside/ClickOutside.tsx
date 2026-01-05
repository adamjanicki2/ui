import React, { cloneElement, useRef } from "react";
import useMergeRefs from "../../hooks/useMergeRefs";
import useClickOutside, { type Config } from "./useClickOutside";

type Props = Pick<Config, "onClickOutside" | "eventType"> & {
  /**
   * The children to render.
   * IMPORTANT: The child must be a single element which can hold a ref.
   */
  children: React.ReactElement<any>;
};

/** Fire a callback when a click occurs outside the child target */
const ClickOutside = ({ children, ...rest }: Props): React.JSX.Element => {
  const elementRef = useRef<Element | null>(null);
  const mergedRef = useMergeRefs<Element>(elementRef, children.props.ref);

  useClickOutside({ targets: [elementRef.current], ...rest });

  return cloneElement(children, {
    ref: mergedRef,
  });
};

export default ClickOutside;
