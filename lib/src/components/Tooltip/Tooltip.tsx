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
  animateFrom,
  animateTo,
  ...floatingProps
}: TooltipProps) => {
  const [open, setOpen] = useState(false);

  if (disabled) return children;

  const anchor = React.cloneElement(children, {
    onMouseEnter: (e: React.MouseEvent) => {
      children.props?.onMouseEnter?.(e);
      setOpen(true);
    },
    onMouseLeave: (e: React.MouseEvent) => {
      children.props?.onMouseLeave?.(e);
      setOpen(false);
    },
  });

  return (
    <Floating
      {...floatingProps}
      role="tooltip"
      anchor={anchor}
      visible={open}
      animateFrom={animateFrom ?? { style: { opacity: 0 } }}
      animateTo={animateTo ?? { style: { opacity: 1 } }}
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
