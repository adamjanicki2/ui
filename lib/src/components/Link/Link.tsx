import React from "react";
import { getButtonClassName, type VisualButtonProps } from "../Button/Button";
import classNames from "../../functions/classNames";
import { Layout } from "../../utils/types";
import transformLayout from "../../utils/transformLayout";

type BaseLinkProps = Omit<
  React.DetailedHTMLProps<
    React.AnchorHTMLAttributes<HTMLAnchorElement>,
    HTMLAnchorElement
  >,
  "href"
> & {
  /**
   * URL to navigate to
   */
  to?: string;
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
   * Additional styles to apply to the layout that are transformed to classNames to be easier to override if needed
   */
  layout?: Layout;
};

export const UnstyledLink = React.forwardRef<HTMLAnchorElement, LinkProps>(
  ({ LinkElement, to, className, external, layout, ...rest }, ref) => {
    const props = {
      ...(external ? { target: "_blank", rel: "noreferrer noopener" } : {}),
      ...rest,
      className: classNames("aui-action", transformLayout(layout), className),
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
>(({ className, variant, corners, size, ...props }, ref) => (
  <UnstyledLink
    {...props}
    className={classNames(
      getButtonClassName({ variant, corners, size }),
      className
    )}
    ref={ref}
  />
));

const Link = React.forwardRef<HTMLAnchorElement, LinkProps>(
  ({ className, ...props }, ref) => (
    <UnstyledLink
      {...props}
      className={classNames("aui-link", className)}
      ref={ref}
    />
  )
);

export default Link;
