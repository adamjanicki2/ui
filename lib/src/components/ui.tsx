import React from "react";
import type { Layout } from "../utils/types";
import { classNames } from "../functions";
import transformLayout from "../utils/transformLayout";

type HtmlTag = keyof React.JSX.IntrinsicElements;

type Props<T extends HtmlTag> = React.ComponentPropsWithRef<T> & {
  /**
   * The organization of this element and its children.
   * Properties are translated to class names before being applied.
   */
  layout?: Layout;
};

function createLayoutElement<T extends HtmlTag>(tag: T) {
  const Component = React.forwardRef<React.ComponentRef<T>, Props<T>>(
    ({ layout, className, ...props }, ref) =>
      React.createElement(tag, {
        ...props,
        ref,
        className: classNames(transformLayout(layout), className),
      })
  );

  return Component;
}

type HtmlTags = {
  [K in HtmlTag]: ReturnType<typeof createLayoutElement<K>>;
};

const ui = new Proxy(
  {},
  {
    get: (cache: Partial<HtmlTags>, tag: HtmlTag) => {
      const cachedComponent = cache[tag];
      if (cachedComponent) {
        return cachedComponent;
      }
      const component = createLayoutElement(tag);
      cache[tag] = component;
      return component;
    },
  }
) as HtmlTags;

export default ui;
