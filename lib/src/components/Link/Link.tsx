import React from "react";
import { getButtonClassName, type VisualButtonProps } from "../Button/Button";
import classNames from "../../functions/classNames";
import { Fx } from "../../utils/types";
import transformFx from "../../utils/transformFx";

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
  fx?: Fx;
};

export const UnstyledLink = React.forwardRef<HTMLAnchorElement, LinkProps>(
  ({ LinkElement, to, className, external, fx, ...rest }, ref) => {
    const props = {
      ...(external ? { target: "_blank", rel: "noreferrer noopener" } : {}),
      ...rest,
      className: classNames("aui-action", transformFx(fx), className),
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
>(({ className, fx, variant, corners, size, ...props }, ref) => (
  <UnstyledLink
    {...props}
    className={classNames(
      getButtonClassName({ variant, corners, size }),
      transformFx(fx),
      className
    )}
    ref={ref}
  />
));

const Link = React.forwardRef<HTMLAnchorElement, LinkProps>(
  ({ className, fx, ...props }, ref) => (
    <UnstyledLink
      {...props}
      className={classNames("aui-link", transformFx(fx), className)}
      ref={ref}
    />
  )
);

export default Link;
