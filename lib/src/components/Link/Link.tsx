import React, { forwardRef } from "react";
import classNames from "../../functions/classNames";

type BuiltinLinkProps = Omit<
  React.DetailedHTMLProps<
    React.AnchorHTMLAttributes<HTMLAnchorElement>,
    HTMLAnchorElement
  >,
  "href"
>;

export type CustomLinkElement = React.ForwardRefExoticComponent<
  BuiltinLinkProps & {
    to: string;
  } & React.RefAttributes<HTMLAnchorElement>
>;

type DefaultLinkProps = BuiltinLinkProps & {
  /**
   * URL to navigate to
   */
  to: string;
  /**
   * [Optional] Custom link element to use
   * This is useful for using a different link element, like a React Router Link
   * If this is not provided, a normal anchor tag will be used
   */
  LinkElement?: CustomLinkElement;
};

const DefaultLinkElement: CustomLinkElement = forwardRef<
  HTMLAnchorElement,
  Partial<BuiltinLinkProps & { to: string }>
>(({ to, ...props }, ref) => <a {...props} href={to} ref={ref} />);

export const UnstyledLink = forwardRef<HTMLAnchorElement, DefaultLinkProps>(
  ({ LinkElement = DefaultLinkElement, className, ...props }, ref) => (
    <LinkElement
      {...props}
      className={classNames("ajui-action", className)}
      ref={ref}
    />
  )
);

const Link = forwardRef<HTMLAnchorElement, DefaultLinkProps>(
  ({ className, ...props }, ref) => (
    <UnstyledLink
      {...props}
      className={classNames("ajui-link-default", className)}
      ref={ref}
    />
  )
);

export default Link;
