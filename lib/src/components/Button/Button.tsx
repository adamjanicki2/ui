import React from "react";
import type { CornerType, Layout } from "../../utils/types";
import classNames from "../../functions/classNames";
import transformLayout from "../../utils/transformLayout";
import Icon, { Props as IconProps } from "../Icon/Icon";

type BaseButtonProps = React.DetailedHTMLProps<
  React.ButtonHTMLAttributes<HTMLButtonElement>,
  HTMLButtonElement
>;

type DefaultButtonProps = BaseButtonProps & {
  /**
   * Additional styles to apply to the layout that are transformed to classNames to be easier to override if needed
   */
  layout?: Layout;
};

export type VisualButtonProps = {
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

type ButtonProps = DefaultButtonProps & VisualButtonProps;

export const UnstyledButton = React.forwardRef<
  HTMLButtonElement,
  DefaultButtonProps
>(({ className, layout, ...props }, ref) => (
  <button
    {...props}
    className={classNames(
      "aui-action aui-button",
      transformLayout(layout),
      className
    )}
    ref={ref}
  />
));

type IconButtonProps = Omit<BaseButtonProps, "children"> & {
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
  ({ icon, size, iconProps, variant = "dim", className, ...rest }, ref) => {
    return (
      <UnstyledButton
        {...rest}
        layout={{ axis: "x", align: "center", justify: "center" }}
        className={classNames(`aui-${variant}`, className)}
        ref={ref}
      >
        <Icon icon={icon} size={size} {...iconProps} />
      </UnstyledButton>
    );
  }
);

const Button = React.forwardRef<HTMLButtonElement, ButtonProps>(
  ({ variant, layout, corners, className, size, ...rest }, ref) => (
    <UnstyledButton
      {...rest}
      className={classNames(
        getButtonClassName({ variant, corners, size }),
        transformLayout(layout),
        className
      )}
      ref={ref}
    />
  )
);

export const getButtonClassName = ({
  variant = "primary",
  corners = "rounded",
  size = "regular",
}: VisualButtonProps) =>
  `aui-button--${variant} aui-button-size--${size} aui-corners--${corners}`;

export default Button;
