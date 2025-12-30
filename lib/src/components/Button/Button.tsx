import React from "react";
import classNames from "../../functions/classNames";
import Icon, { Props as IconProps } from "../Icon/Icon";
import ui from "../../ui";

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
  (
    { icon, size, vfx, iconProps, variant = "dim", className, ...rest },
    ref
  ) => {
    return (
      <UnstyledButton
        {...rest}
        vfx={{ axis: "x", align: "center", justify: "center", ...vfx }}
        className={classNames(`aui-${variant}`, className)}
        ref={ref}
      >
        <Icon icon={icon} size={size} {...iconProps} />
      </UnstyledButton>
    );
  }
);

const vfxBySize = {
  small: { fontSize: "xs", padding: "xs" },
  regular: { padding: "s" },
} as const;

const Button = React.forwardRef<HTMLButtonElement, ButtonProps>(
  ({ variant, className, vfx, size, ...rest }, ref) => {
    const { vfx: additionalVfx, className: additionalClassName } =
      getButtonProps({ variant, size });
    return (
      <UnstyledButton
        {...rest}
        vfx={{ ...additionalVfx, ...vfx }}
        className={classNames(additionalClassName, className)}
        ref={ref}
      />
    );
  }
);

export const getButtonProps = ({
  variant = "primary",
  size = "regular",
}: VisualButtonProps) =>
  ({
    className: `aui-button-${variant}`,
    vfx: { ...vfxBySize[size], radius: "rounded", fontWeight: 6 },
  } as const);

export default Button;
