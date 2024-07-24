import React, { forwardRef } from "react";
import { classNames } from "../../utils/util";

type BuiltinLinkProps = Omit<
  React.DetailedHTMLProps<
    React.AnchorHTMLAttributes<HTMLAnchorElement>,
    HTMLAnchorElement
  >,
  "href"
>;

export type CustomLinkElement = (
  props: Partial<BuiltinLinkProps> & {
    to: string;
  } & { ref?: React.MutableRefObject<HTMLAnchorElement> }
) => React.ReactNode;

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
  ({ LinkElement = DefaultLinkElement, ...props }, ref) => (
    <LinkElement
      {...props}
      ref={ref as React.MutableRefObject<HTMLAnchorElement>}
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
