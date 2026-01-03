import React from "react";
import classNames from "../../functions/classNames";
import ui from "../ui";

type DefaultButtonProps = React.ComponentProps<typeof ui.button>;

/** Visual styling options for `Button` and `ButtonLink`. */
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

/** An unstyled `button` */
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

const vfxBySize = {
  small: { fontSize: "xs", padding: "xs" },
  regular: { padding: "s" },
} as const;

/** A styled `button` component */
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
