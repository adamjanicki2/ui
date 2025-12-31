import React, { useRef, useState, useEffect } from "react";
import Box, { type BoxProps } from "../Box/Box";
import Icon from "../Icon";
import { UnstyledButton } from "../Button";
import Animated from "../Animated";
import type { ReadonlyableArray } from "../../utils/types";
import { chevronDown, chevronRight } from "../../icons";

type Props = Omit<BoxProps, "children"> & {
  /**
   * Drawers to render as accordion sections
   */
  drawers: ReadonlyableArray<Drawer>;
  /**
   * Duration of the drawer animation (in seconds)
   */
  duration?: number;
  /**
   * Whether to hide the dividers between drawers
   * @default false
   */
  hideDividers?: boolean;
};

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
  /**
   * Label for the accordion drawer
   */
  label: string;
  /**
   * Content hidden within this accordion drawer
   */
  content: React.ReactNode;
  /**
   * Whether the drawer is open
   */
  open: boolean;
  /**
   * Callback that fires when the open state changes for this drawer
   */
  onOpenChange: (open: boolean) => void;
};

type DrawerProps = {
  item: Drawer;
  duration?: number;
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
    <>
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
          animateFrom={{
            style: {
              visibility: "hidden",
              height: 0,
              transform: "translateY(-4px)",
              opacity: 0.9,
            },
          }}
          animateTo={{
            style: { height, transform: "translateY(0)", opacity: 1 },
          }}
        >
          <Box ref={boxRef}>{children}</Box>
        </Animated>
      </Box>
    </>
  );
};

export default Accordion;
