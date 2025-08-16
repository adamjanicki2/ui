import React, { forwardRef } from "react";
import { type CustomLinkElement, UnstyledLink } from "../Link/Link";
import type { CornerType } from "../../utils/types";
import classNames from "../../functions/classNames";

type DefaultButtonProps = React.DetailedHTMLProps<
  React.ButtonHTMLAttributes<HTMLButtonElement>,
  HTMLButtonElement
> & {
  /**
   * [Optional] This can be used as a link if the `to` prop is provided
   * If this is the case, the onClick event will be ignored
   */
  to?: string;
  /**
   * [Optional] Custom link element to use
   * This is useful for using a different link element, like a React Router Link
   * If this is not provided, a normal anchor tag will be used
   */
  LinkElement?: CustomLinkElement;
};

type ButtonProps = DefaultButtonProps & {
  /**
   * Type of button
   * @default "primary"
   */
  variant?: "primary" | "secondary";
  /**
   * Type of corners on the button
   * @default "rounded"
   */
  corners?: CornerType;
  /**
   * [Optional] Size of the button, if wishing to make smaller
   * @default "regular"
   */
  size?: "regular" | "small";
};

export const UnstyledButton = forwardRef<HTMLButtonElement, DefaultButtonProps>(
  ({ to, LinkElement, className, ...props }, ref) => {
    className = classNames("aui-button-base", className);
    if (to) {
      return (
        <UnstyledLink
          to={to}
          className={className}
          style={props.style}
          role="button"
          LinkElement={LinkElement}
          // accessibility props
          aria-label={props["aria-label"]}
        >
          {props.children}
        </UnstyledLink>
      );
    }
    return (
      <button
        {...props}
        className={classNames("aui-action", className)}
        ref={ref}
      />
    );
  }
);

const Button = forwardRef<HTMLButtonElement, ButtonProps>(
  (
    {
      variant = "primary",
      corners = "rounded",
      className,
      size = "regular",
      ...rest
    },
    ref
  ) => (
    <UnstyledButton
      {...rest}
      className={classNames(
        `aui-button--${variant} aui-button-size--${size} aui-corners--${corners}`,
        className
      )}
      ref={ref}
    />
  )
);

export default Button;
