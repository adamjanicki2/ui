import React from "react";

import classNames from "../../functions/classNames";
import Icon, { type Props as IconProps } from "../Icon/Icon";
import { UnstyledButton } from "./Button";

type DefaultButtonProps = React.ComponentProps<typeof UnstyledButton>;

type IconButtonProps = Omit<DefaultButtonProps, "children"> & {
  /**
   * The hover effect to play when the user hovers over the button.
   * @default "dim"
   */
  variant?: "dim" | "undim";
  /** Which icon to render in the button */
  icon: IconProps["icon"];
  /** The size of the icon */
  size?: IconProps["size"];
  /** Other props to pass to the icon element */
  iconProps?: Omit<IconProps, "icon" | "size">;
};

/** A button that renders an `Icon` component */
export const IconButton = React.forwardRef<HTMLButtonElement, IconButtonProps>(
  (
    { icon, size, vfx, iconProps, variant = "dim", className, ...rest },
    ref
  ) => (
    <UnstyledButton
      {...rest}
      vfx={{ axis: "x", align: "center", justify: "center", ...vfx }}
      className={classNames(`aui-${variant}`, className)}
      ref={ref}
    >
      <Icon icon={icon} size={size} {...iconProps} />
    </UnstyledButton>
  )
);
