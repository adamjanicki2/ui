import React from "react";
import type { Vfx } from "../../types/common";
import { classNames } from "../../functions";
import transformVfx from "./transformVfx";

type HtmlTag = keyof JSX.IntrinsicElements;

type Props<T extends HtmlTag> = React.ComponentPropsWithoutRef<T> & {
  /**
   * The VFX or other organizational css to apply to this element.
   * Properties are translated to class names before being applied.
   */
  vfx?: Vfx;
};

type VfxComponent<T extends HtmlTag> = React.ForwardRefExoticComponent<
  React.PropsWithoutRef<Props<T>> & React.RefAttributes<React.ElementRef<T>>
>;

function createVfxElement<T extends HtmlTag>(tag: T): VfxComponent<T> {
  return React.forwardRef<React.ElementRef<T>, Props<T>>(
    ({ vfx, className, ...props }, ref) =>
      React.createElement(tag, {
        ...props,
        ref,
        className: classNames(className, transformVfx(vfx)),
      })
  );
}

type UI = { [T in HtmlTag]: VfxComponent<T> };

const ui = new Proxy(
  {},
  {
    get(cache: Partial<Record<HtmlTag, unknown>>, prop: HtmlTag) {
      const cached = cache[prop];
      if (cached) return cached;

      const component = createVfxElement(prop);
      cache[prop] = component;
      return component;
    },
  }
) as UI;

export default ui;
