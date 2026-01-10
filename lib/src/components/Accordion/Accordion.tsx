import React, { useEffect, useRef, useState } from "react";

import { chevronDown, chevronRight } from "../../icons";
import type { ReadonlyableArray } from "../../types/common";
import Animated from "../Animated";
import Box, { type BoxProps } from "../Box/Box";
import { UnstyledButton } from "../Button";
import Icon from "../Icon";

type Props = Omit<BoxProps, "children"> & {
  /** Drawers to render as accordion sections */
  drawers: ReadonlyableArray<Drawer>;
  /** Duration of the drawer animation (in seconds) */
  duration?: number;
  /**
   * Whether to hide the dividers between drawers.
   * @default false
   */
  hideDividers?: boolean;
};

/** A vertical list of collapsible drawers */
const Accordion = React.forwardRef<HTMLDivElement, Props>(
  ({ drawers, duration, hideDividers, vfx, ...rest }, ref) => (
    <Box
      vfx={{
        axis: "y",
        radius: "rounded",
        color: "default",
        backgroundColor: "default",
        shadow: "subtle",
        border: true,
        ...vfx,
      }}
      {...rest}
      ref={ref}
    >
      {drawers.map((item, i) => (
        <Drawer
          key={i}
          item={item}
          duration={duration}
          showDivider={!hideDividers && i < drawers.length - 1}
        />
      ))}
    </Box>
  )
);

type Drawer = {
  /** Content hidden within this accordion drawer */
  content: React.ReactNode;
  /** Label for the accordion drawer */
  label: string;
  /** Callback that fires when the open state changes for this drawer */
  onOpenChange: (open: boolean) => void;
  /** Whether the drawer is open */
  open: boolean;
};

type DrawerProps = {
  duration?: number;
  item: Drawer;
  showDivider: boolean;
};
const Drawer = ({ item, duration, showDivider }: DrawerProps) => {
  const boxRef = useRef<HTMLDivElement | null>(null);
  const [height, setHeight] = useState<number>();

  const { content: children, open, onOpenChange } = item;

  useEffect(() => {
    if (open && children && boxRef.current) {
      setHeight(boxRef.current.offsetHeight);
    }
  }, [open, children]);

  // TODO: change this to use calc-size when supported
  // https://developer.mozilla.org/en-US/docs/Web/CSS/calc-size#browser_compatibility

  return (
    <Box vfx={{ axis: "y", borderBottom: showDivider }}>
      <UnstyledButton onClick={() => onOpenChange(!open)}>
        <Box vfx={{ axis: "x", align: "center", gap: "s", padding: "m" }}>
          <Icon
            vfx={{ color: "muted" }}
            size="xs"
            icon={open ? chevronDown : chevronRight}
          />
          <Box vfx={{ fontWeight: 6 }}>{item.label}</Box>
        </Box>
      </UnstyledButton>
      <Animated
        vfx={{ overflow: "hidden" }}
        keepMounted
        duration={duration}
        visible={open}
        from={{
          visibility: "hidden",
          height: 0,
          transform: "translateY(-4px)",
          opacity: 0.9,
        }}
        to={{
          height,
          transform: "translateY(0)",
          opacity: 1,
        }}
      >
        <Box ref={boxRef}>{children}</Box>
      </Animated>
    </Box>
  );
};

export default Accordion;
