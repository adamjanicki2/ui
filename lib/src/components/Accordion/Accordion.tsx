import React, { useState, useRef, useEffect } from "react";
import Box from "../Box";
import Icon from "../Icon";
import { UnstyledButton } from "../Button";
import Animated from "../Animated";
import type { Style } from "../../utils/types";
import { classNames } from "../../functions";

type Props = {
  /**
   * Drawers to render as accordion sections
   */
  drawers: Drawer[];
  /**
   * [Optional] additional class name to apply to the accordion
   */
  className?: string;
  /**
   * [Optional] additional styles to apply to the accordion
   */
  style?: Style;
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
  ({ drawers, className, style, duration, hideDividers }, ref) => {
    const [openIndices, setOpenIndices] = useState<Set<number>>(new Set());

    return (
      <Box
        layout={{ axis: "y" }}
        className={classNames("aui-accordion aui-corners--rounded", className)}
        style={style}
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

  useEffect(() => {
    if (boxRef.current) {
      setHeight(boxRef.current.offsetHeight);
    }
  }, [open, item.content]);

  // TODO: change this to use calc-size when supported
  // https://developer.mozilla.org/en-US/docs/Web/CSS/calc-size#browser_compatibility

  console.log({ height, open });

  return (
    <>
      <Box layout={{ axis: "y" }}>
        <UnstyledButton onClick={() => onOpenChange(!open)}>
          <Box layout={{ axis: "x", align: "center", gap: "m", padding: "l" }}>
            <Icon
              size={12}
              icon={open ? "down" : "right"}
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
          <Box ref={boxRef}>{item.content}</Box>
        </Animated>
      </Box>
      {showDivider && <hr className="aui-accordion-hr" />}
    </>
  );
};

export default Accordion;
