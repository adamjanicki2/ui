import React, { useState } from "react";
import type { Children } from "../../types/common";
import Floating from "../Floating/Floating";

type FloatingProps = React.ComponentProps<typeof Floating>;

export type TooltipProps = Omit<
  FloatingProps,
  "onMouseEnter" | "onMouseLeave" | "visible" | "floatingContent" | "anchor"
> & {
  /** Children to render inside the tooltip container */
  tooltipContent: Children;
  /**
   * The element to attach the tooltip to.
   * IMPORTANT: This must be able to hold a ref.
   */
  children: React.ReactElement<any>;
  /**
   * Whether the tooltip is disabled. If true, will not show the tooltip.
   * @default false
   */
  disabled?: boolean;
};

const Tooltip = ({
  tooltipContent,
  children,
  disabled = false,
  vfx,
  ...floatingProps
}: TooltipProps) => {
  const [open, setOpen] = useState(false);

  if (disabled) return children;

  const anchor = React.cloneElement(children, {
    onMouseEnter: (e: React.MouseEvent) => {
      children.props?.onMouseEnter?.(e);
      if (!disabled) setOpen(true);
    },
    onMouseLeave: (e: React.MouseEvent) => {
      children.props?.onMouseLeave?.(e);
      setOpen(false);
    },
    onFocus: (e: React.FocusEvent) => {
      children.props?.onFocus?.(e);
      setOpen(true);
    },
    onBlur: (e: React.FocusEvent) => {
      children.props?.onBlur?.(e);
      setOpen(false);
    },
  });

  return (
    <Floating
      {...floatingProps}
      role="tooltip"
      anchor={anchor}
      visible={open}
      vfx={{
        padding: "s",
        backgroundColor: "default",
        border: true,
        shadow: "floating",
        radius: "rounded",
        z: "floating",
        ...vfx,
      }}
      floatingContent={tooltipContent}
    />
  );
};

export default Tooltip;
