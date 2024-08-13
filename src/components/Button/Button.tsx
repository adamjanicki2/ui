import React, { forwardRef } from "react";
import { CustomLinkElement, UnstyledLink } from "../Link/Link";
import { CornerType } from "../../utils/types";
import { classNames } from "../../utils/util";

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

type IconButtonProps = Omit<DefaultButtonProps, "children" | "aria-label"> & {
  /**
   * Name of the button for accessibility purposes
   */
  "aria-label": string;
  /**
   * Icon to display inside the button
   * I would usually use FontAwesome, but for added flexibility, it's any node
   */
  icon: React.ReactNode;
};

type ButtonProps = DefaultButtonProps & {
  /**
   * Type of button
   * @default "primary"
   */
  variant?: "primary" | "secondary" | "transparent";
  /**
   * Type of corners on the button
   * @default "rounded"
   */
  corners?: CornerType;
};

export const UnstyledButton = forwardRef<HTMLButtonElement, DefaultButtonProps>(
  ({ to, LinkElement, className, ...props }, ref) => {
    className = classNames("ajui-button-base", className);
    if (to) {
      return (
        <UnstyledLink
          to={to}
          className={className}
          style={props.style}
          role="button"
          children={props.children}
          LinkElement={LinkElement}
          // accessibility props
          aria-label={props["aria-label"]}
        />
      );
    }
    return <button {...props} className={className} ref={ref} />;
  }
);

export const IconButton = forwardRef<HTMLButtonElement, IconButtonProps>(
  ({ icon, className, ...props }, ref) => (
    <UnstyledButton
      {...props}
      className={classNames("ajui-icon-button", className)}
      ref={ref}
    >
      {icon}
    </UnstyledButton>
  )
);

const Button = forwardRef<HTMLButtonElement, ButtonProps>(
  ({ variant = "primary", corners = "rounded", className, ...rest }, ref) => (
    <UnstyledButton
      {...rest}
      className={classNames(
        `ajui-button-default ajui-button--${variant} corners--${corners}`,
        className
      )}
      ref={ref}
    />
  )
);

export default Button;
