import React, { useState, useRef, useEffect } from "react";
import Box, { type BoxProps } from "../Box/Box";
import Icon from "../Icon";
import { UnstyledButton } from "../Button";
import Animated from "../Animated";
import { classNames } from "../../functions";

type Props = Omit<BoxProps, "children"> & {
  /**
   * Drawers to render as accordion sections
   */
  drawers: Drawer[];
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
  ({ drawers, className, duration, hideDividers, layout, ...rest }, ref) => {
    const [openIndices, setOpenIndices] = useState<Set<number>>(new Set());

    return (
      <Box
        layout={{ axis: "y", ...layout }}
        {...rest}
        className={classNames("aui-accordion aui-corners--rounded", className)}
        ref={ref}
      >
        {drawers.map((item, i) => (
          <Drawer
            key={i}
            item={item}
            open={openIndices.has(i)}
            onOpenChange={(open) =>
              setOpenIndices((prev) => {
                const next = new Set(prev);
                if (open) {
                  next.add(i);
                } else {
                  next.delete(i);
                }
                return next;
              })
            }
            duration={duration}
            showDivider={!hideDividers && i < drawers.length - 1}
          />
        ))}
      </Box>
    );
  }
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
};

type DrawerProps = {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  item: Drawer;
  duration?: number;
  showDivider: boolean;
};
const Drawer = ({
  item,
  open,
  onOpenChange,
  duration,
  showDivider,
}: DrawerProps) => {
  const boxRef = useRef<HTMLDivElement | null>(null);
  const [height, setHeight] = useState<number>();

  const children = item.content;

  useEffect(() => {
    if (open && children && boxRef.current) {
      setHeight(boxRef.current.offsetHeight);
    }
  }, [open, children]);

  // TODO: change this to use calc-size when supported
  // https://developer.mozilla.org/en-US/docs/Web/CSS/calc-size#browser_compatibility

  return (
    <>
      <Box layout={{ axis: "y" }}>
        <UnstyledButton onClick={() => onOpenChange(!open)}>
          <Box layout={{ axis: "x", align: "center", gap: "s", padding: "m" }}>
            <Icon
              size="xs"
              icon={open ? "chevron-down" : "chevron-right"}
              className="aui-accordion-arrow"
            />
            <span className="aui-accordion-label">{item.label}</span>
          </Box>
        </UnstyledButton>
        <Animated
          style={{ overflow: "hidden" }}
          keepMounted
          duration={duration}
          animated={open}
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
      {showDivider && <hr className="aui-accordion-hr" />}
    </>
  );
};

export default Accordion;
