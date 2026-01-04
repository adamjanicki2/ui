import { useState } from "react";
import Para from "src/components/Para";
import Page from "src/components/Page";
import { ShowcaseBlock, ShowcaseRow } from "src/components/Showcase";
import { Box, Button } from "@adamjanicki/ui";
import Floating from "@adamjanicki/ui/components/Floating";
import Popover from "@adamjanicki/ui/components/Popover";

type DemoProps = {
  placement: "top" | "bottom" | "left" | "right";
  title: string;
};

function FloatingDemo({ placement, title }: DemoProps) {
  const [visible, setVisible] = useState(false);

  return (
    <Box vfx={{ axis: "y", gap: "xs", width: "fit" }}>
      <Box vfx={{ fontWeight: 6 }}>{title}</Box>
      <Floating
        placement={placement}
        visible={visible}
        anchor={
          <Button variant="secondary" onClick={() => setVisible((p) => !p)}>
            {visible ? "Hide" : "Show"}
          </Button>
        }
        animateTo={{ style: { opacity: 1 } }}
        animateFrom={{ style: { opacity: 0 } }}
        transitionProperties={["opacity"]}
        floatingContent={
          <Box
            vfx={{
              axis: "y",
              gap: "xxs",
              padding: "s",
              radius: "rounded",
              border: true,
              shadow: "floating",
              backgroundColor: "default",
              color: "default",
            }}
            style={{ width: 220 }}
          >
            <Box vfx={{ fontWeight: 6 }}>Floating</Box>
            <Box vfx={{ color: "muted", fontSize: "s" }}>
              placement: {placement}
            </Box>
          </Box>
        }
      />
    </Box>
  );
}

function PopoverDemo({ placement, title }: DemoProps) {
  const [open, setOpen] = useState(false);

  return (
    <Box vfx={{ axis: "y", gap: "xs", width: "fit" }}>
      <Box vfx={{ fontWeight: 6 }}>{title}</Box>
      <Popover
        placement={placement}
        open={open}
        onClose={() => setOpen(false)}
        anchor={
          <Button variant="secondary" onClick={() => setOpen((p) => !p)}>
            {open ? "Hide" : "Show"}
          </Button>
        }
      >
        <Box vfx={{ axis: "y", gap: "xxs" }} style={{ width: 220 }}>
          <Box vfx={{ fontWeight: 6 }}>Popover</Box>
          <Box vfx={{ color: "muted", fontSize: "s" }}>
            placement: {placement}
          </Box>
        </Box>
      </Popover>
    </Box>
  );
}

export default function FloatingPage() {
  return (
    <Page title="Floating">
      <Para>
        And without further ado, I present the most complex components in the
        library: the relatively-positioned floating components.
      </Para>

      <ShowcaseBlock title="Placements">
        <ShowcaseRow vfx={{ gap: "l" }}>
          <FloatingDemo placement="top" title="Top" />
          <FloatingDemo placement="right" title="Right" />
          <FloatingDemo placement="bottom" title="Bottom" />
          <FloatingDemo placement="left" title="Left" />
        </ShowcaseRow>
      </ShowcaseBlock>

      <ShowcaseBlock
        title="Popover"
        description={
          <>
            Built on top of <code>Floating</code>. Click outside or press Escape
            to dismiss.
          </>
        }
      >
        <ShowcaseRow vfx={{ gap: "l" }}>
          <PopoverDemo placement="top" title="Top" />
          <PopoverDemo placement="right" title="Right" />
          <PopoverDemo placement="bottom" title="Bottom" />
          <PopoverDemo placement="left" title="Left" />
        </ShowcaseRow>
      </ShowcaseBlock>
    </Page>
  );
}
