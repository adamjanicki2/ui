import React from "react";
import type { CornerType } from "../../utils/types";
import classNames from "../../functions/classNames";

type DefaultButtonProps = React.DetailedHTMLProps<
  React.ButtonHTMLAttributes<HTMLButtonElement>,
  HTMLButtonElement
>;

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
>(({ className, ...props }, ref) => (
  <button
    {...props}
    className={classNames("aui-action aui-button", className)}
    ref={ref}
  />
));

const Button = React.forwardRef<HTMLButtonElement, ButtonProps>(
  ({ variant, corners, className, size, ...rest }, ref) => (
    <UnstyledButton
      {...rest}
      className={classNames(
        getButtonClassName({ variant, corners, size }),
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
