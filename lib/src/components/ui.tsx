import React from "react";
import type { Layout } from "../utils/types";
import { classNames } from "../functions";
import transformLayout from "../utils/transformLayout";

type Props<T extends keyof JSX.IntrinsicElements> =
  React.ComponentPropsWithRef<T> & {
    /**
     * The organization of this element and its children.
     * Properties are translated to class names before being applied.
     */
    layout?: Layout;
  };

function createLayoutElement<T extends keyof JSX.IntrinsicElements>(tag: T) {
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

const ui = {
  div: createLayoutElement("div"),
  span: createLayoutElement("span"),
  nav: createLayoutElement("nav"),
  footer: createLayoutElement("footer"),
  p: createLayoutElement("p"),
  br: createLayoutElement("br"),
  button: createLayoutElement("button"),
  pre: createLayoutElement("pre"),
  code: createLayoutElement("code"),
  em: createLayoutElement("em"),
  strong: createLayoutElement("strong"),
  blockquote: createLayoutElement("blockquote"),
  ul: createLayoutElement("ul"),
  ol: createLayoutElement("ol"),
  li: createLayoutElement("li"),
  table: createLayoutElement("table"),
  tr: createLayoutElement("tr"),
  th: createLayoutElement("th"),
  td: createLayoutElement("td"),
  tbody: createLayoutElement("tbody"),
  iframe: createLayoutElement("iframe"),
  section: createLayoutElement("section"),
  main: createLayoutElement("main"),
  h1: createLayoutElement("h1"),
  h2: createLayoutElement("h2"),
  h3: createLayoutElement("h3"),
  h4: createLayoutElement("h4"),
  h5: createLayoutElement("h5"),
  h6: createLayoutElement("h6"),
} as const;

export default ui;
