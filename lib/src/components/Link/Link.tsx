import React from "react";
import { getButtonProps, type VisualButtonProps } from "../Button/Button";
import classNames from "../../functions/classNames";
import { Vfx } from "../../utils/types";
import transformVfx from "../../utils/transformVfx";

export type BaseLinkProps = Omit<
  React.DetailedHTMLProps<
    React.AnchorHTMLAttributes<HTMLAnchorElement>,
    HTMLAnchorElement
  >,
  "href"
> & {
  /**
   * URL to navigate to
   */
  to: string;
};

type CustomLinkElement = React.ForwardRefExoticComponent<
  BaseLinkProps & React.RefAttributes<HTMLAnchorElement>
>;

type LinkProps = BaseLinkProps & {
  /**
   * Whether the link should open in a new tab
   */
  external?: boolean;
  /**
   * [Optional] Custom link element to use
   * This is useful for using a different link element, like a React Router Link
   * If this is not provided, a normal anchor tag will be used
   */
  LinkElement?: CustomLinkElement;
  /**
   * The VFX or other organizational css to apply to this element.
   * Properties are translated to class names before being applied.
   */
  vfx?: Vfx;
};

export const UnstyledLink = React.forwardRef<HTMLAnchorElement, LinkProps>(
  ({ LinkElement, to, className, vfx, external, ...rest }, ref) => {
    const props = {
      ...(external ? { target: "_blank", rel: "noreferrer noopener" } : {}),
      ...rest,
      className: classNames("aui-action", transformVfx(vfx), className),
    };

    if (LinkElement) {
      return <LinkElement {...props} to={to} ref={ref} />;
    }

    return <a {...props} href={to} ref={ref} />;
  }
);

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
