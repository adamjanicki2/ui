import React from "react";
import type { Vfx } from "../../types/common";
import { classNames } from "../../functions";
import transformVfx from "./transformVfx";

type Tag = keyof React.JSX.IntrinsicElements;

type Props<T extends Tag> = React.ComponentPropsWithoutRef<T> & {
  /**
   * The VFX or other organizational css to apply to this element
   * Properties are translated to class names before being applied
   */
  vfx?: Vfx;
};

function createVfxElement<T extends Tag>(tag: T) {
  const Component = React.forwardRef<React.ComponentRef<T>, Props<T>>(
    ({ vfx, className, ...props }, ref) =>
      React.createElement(tag, {
        ...props,
        ref,
        className: classNames(className, transformVfx(vfx)),
      })
  );

  return Component;
}

type UI = {
  [T in Tag]: ReturnType<typeof createVfxElement<T>>;
};

/**
 * Collection of builtin DOM elements that support the `vfx` prop
 *
 * `vfx` is transformed into class names and merged with the `className` property if provided
 *
 * Each element forwards refs and accepts the normal props for that intrinsic element
 *
 * @example <ui.div vfx={{ padding: "m", axis: "y", gap: "s" }} />
 * @example <ui.button vfx={{ radius: "rounded", fontWeight: 6 }} />
 * @example const Card = ui.section
 */
const ui = new Proxy(
  {},
  {
    get: (cache: Partial<UI>, tag: Tag) => {
      const cachedComponent = cache[tag];
      if (cachedComponent) {
        return cachedComponent;
      }

      const component = createVfxElement(tag);
      cache[tag] = component;
      return component;
    },
  }
) as UI;

export default ui;
