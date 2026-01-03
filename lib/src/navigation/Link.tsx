import React from "react";
import ui from "../components/ui";
import {
  getButtonProps,
  type VisualButtonProps,
} from "../components/Button/Button";
import classNames from "../functions/classNames";
import type { Vfx } from "../types/common";
import RouterContext from "./RouterContext";
import { getHref, type Href } from "./href";

type LinkProps = Omit<React.ComponentProps<typeof ui.a>, "href"> & {
  /**
   * URL to navigate to
   */
  to: string;
  /**
   * Whether to open the link in a new tab.
   * @default false
   */
  newTab?: boolean;
  /**
   * The VFX or other organizational css to apply to this element.
   * Properties are translated to class names before being applied.
   */
  vfx?: Vfx;
};

function routeInternally(event: React.MouseEvent<HTMLAnchorElement>) {
  // only route internally if it's a left click and no modifier keys are held down
  return (
    event.button === 0 &&
    !event.defaultPrevented &&
    !event.metaKey &&
    !event.altKey &&
    !event.ctrlKey &&
    !event.shiftKey
  );
}

/**
 * A basic, unstyled link that uses client-side navigation if used within a `<Router>`
 * If rendered outside a `<Router>`, this behaves like a normal `<a>`.
 */
export const UnstyledLink = React.forwardRef<HTMLAnchorElement, LinkProps>(
  ({ to, className, newTab, onClick, target, rel, ...rest }, ref) => {
    const router = React.useContext(RouterContext);

    const href: Href = router
      ? getHref(to, router.location.pathname, router.basename)
      : { type: "unknown", url: to };

    if (newTab) {
      target = "_blank";
      rel = "noreferrer noopener";
    }

    const handleClick = (event: React.MouseEvent<HTMLAnchorElement>) => {
      onClick?.(event);
      if (
        !router ||
        newTab ||
        href.type === "external" ||
        href.type === "octo" ||
        !routeInternally(event)
      ) {
        return;
      }

      event.preventDefault();
      router.navigate(to);
    };

    return (
      <ui.a
        {...rest}
        href={href.url}
        target={target}
        rel={rel}
        className={classNames("aui-action", className)}
        onClick={handleClick}
        ref={ref}
      />
    );
  }
);

/**
 * A styled link that uses client-side navigation if used within a `<Router>`
 * If rendered outside a `<Router>`, this behaves like a normal `<a>`.
 */
export const ButtonLink = React.forwardRef<
  HTMLAnchorElement,
  LinkProps & VisualButtonProps
>(({ className, variant, vfx, size, ...props }, ref) => {
  const { vfx: additionalVfx, className: additionalClassName } = getButtonProps(
    {
      variant,
      size,
    }
  );

  return (
    <UnstyledLink
      {...props}
      className={classNames(additionalClassName, className)}
      vfx={{ ...additionalVfx, ...vfx }}
      ref={ref}
    />
  );
});

/** A styled link element */
const Link = React.forwardRef<HTMLAnchorElement, LinkProps>(
  ({ className, vfx, ...props }, ref) => (
    <UnstyledLink
      {...props}
      vfx={{ fontWeight: 6, ...vfx }}
      className={classNames("aui-link", className)}
      ref={ref}
    />
  )
);

export default Link;
