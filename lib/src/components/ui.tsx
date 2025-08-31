import React from "react";
import type { Fx } from "../utils/types";
import { classNames } from "../functions";
import transformFx from "../utils/transformFx";

type HtmlTag = keyof React.JSX.IntrinsicElements;

type Props<T extends HtmlTag> = React.ComponentPropsWithRef<T> & {
  /**
   * The VFX or other organizational css to apply to this element.
   * Properties are translated to class names before being applied.
   */
  fx?: Fx;
};

function createFxElement<T extends HtmlTag>(tag: T) {
  const Component = React.forwardRef<React.ComponentRef<T>, Props<T>>(
    ({ fx, className, ...props }, ref) =>
      React.createElement(tag, {
        ...props,
        ref,
        className: classNames(transformFx(fx), className),
      })
  );

  return Component;
}

type HtmlTags = {
  [K in HtmlTag]: ReturnType<typeof createFxElement<K>>;
};

const ui = new Proxy(
  {},
  {
    get: (cache: Partial<HtmlTags>, tag: HtmlTag) => {
      const cachedComponent = cache[tag];
      if (cachedComponent) {
        return cachedComponent;
      }
      const component = createFxElement(tag);
      cache[tag] = component;
      return component;
    },
  }
) as HtmlTags;

export default ui;
