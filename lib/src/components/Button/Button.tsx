import React from "react";
import classNames from "../../functions/classNames";
import Icon, { Props as IconProps } from "../Icon/Icon";
import ui from "../ui";

type DefaultButtonProps = React.ComponentProps<typeof ui.button>;

export type VisualButtonProps = {
  /**
   * Type of button
   * @default "primary"
   */
  variant?: "primary" | "secondary";
  /**
   * [Optional] Size of the button, if wishing to make smaller
   * @default "regular"
   */
  size?: "regular" | "small";
};

type ButtonProps = DefaultButtonProps & VisualButtonProps;

export const UnstyledButton = React.forwardRef<
  HTMLButtonElement,
  DefaultButtonProps
>(({ className, ...props }, ref) => (
  <ui.button
    {...props}
    className={classNames("aui-action aui-button", className)}
    ref={ref}
  />
));

type IconButtonProps = Omit<DefaultButtonProps, "children"> & {
  /**
   * The hover effect to play when the user hovers over the button
   * @default "dim"
   */
  variant?: "dim" | "undim";
  /**
   * Which icon to render in the button
   */
  icon: IconProps["icon"];
  /**
   * The size of the icon
   */
  size?: IconProps["size"];
  /**
   * Other props to pass to the icon element
   */
  iconProps?: Omit<IconProps, "icon" | "size">;
};

export const IconButton = React.forwardRef<HTMLButtonElement, IconButtonProps>(
  ({ icon, size, fx, iconProps, variant = "dim", className, ...rest }, ref) => {
    return (
      <UnstyledButton
        {...rest}
        fx={{ axis: "x", align: "center", justify: "center", ...fx }}
        className={classNames(`aui-${variant}`, className)}
        ref={ref}
      >
        <Icon icon={icon} size={size} {...iconProps} />
      </UnstyledButton>
    );
  }
);

const Button = React.forwardRef<HTMLButtonElement, ButtonProps>(
  ({ variant, className, fx, size, ...rest }, ref) => (
    <UnstyledButton
      {...rest}
      fx={{ radius: "rounded", ...fx }}
      className={classNames(getButtonClassName({ variant, size }), className)}
      ref={ref}
    />
  )
);

export const getButtonClassName = ({
  variant = "primary",
  size = "regular",
}: VisualButtonProps) => `aui-button--${variant} aui-button-size--${size}`;

export default Button;
