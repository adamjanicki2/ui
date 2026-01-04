import { useMemo, useState } from "react";
import Para from "src/components/Para";
import Page from "src/components/Page";
import {
  ShowcaseBlock,
  ShowcaseRow,
  LabeledField,
} from "src/components/Showcase";
import { Box, Button, Input, Select, ui } from "@adamjanicki/ui";
import Floating from "@adamjanicki/ui/components/Floating";

function FloatingPage() {
  const placements = useMemo(
    () => ["top", "bottom", "left", "right"] as const,
    []
  );
  type Placement = (typeof placements)[number];

  const alignments = useMemo(() => ["start", "center", "end"] as const, []);
  type Alignment = (typeof alignments)[number];

  const verticalPositions = useMemo(
    () => ["top", "middle", "bottom"] as const,
    []
  );
  type VerticalPosition = (typeof verticalPositions)[number];

  const [enabled, setEnabled] = useState(true);
  const [placement, setPlacement] = useState<Placement>("bottom");
  const [flip, setFlip] = useState(true);
  const [offset, setOffset] = useState(0);
  const [xAlign, setXAlign] = useState<Alignment>("center");
  const [yPos, setYPos] = useState<VerticalPosition>("middle");

  const spacerHeight = useMemo(() => {
    const spacerByPos: Record<VerticalPosition, number> = {
      top: 16,
      middle: 220,
      bottom: 460,
    };
    return spacerByPos[yPos];
  }, [yPos]);

  const anchor = (
    <Button
      variant="secondary"
      style={{ width: 160 }}
      onClick={() => setEnabled((prev) => !prev)}
    >
      {enabled ? "Hide content" : "Show content"}
    </Button>
  );

  return (
    <Page title="Floating">
      <Para>
        A positioning primitive for building things like tooltips, popovers, and
        autocomplete. This page is a small playground for testing placement,
        offset, flipping, and re-positioning during scroll/resize.
      </Para>

      <ShowcaseBlock title="Playground">
        <Box
          vfx={{ axis: "y", gap: "m" }}
          style={{ maxWidth: 900, marginLeft: "auto", marginRight: "auto" }}
        >
          <ShowcaseRow vfx={{ justify: "between", width: "full" }}>
            <LabeledField label="Floating visible">
              <Button
                variant="primary"
                onClick={() => setEnabled((prev) => !prev)}
              >
                {enabled ? "Enabled" : "Disabled"}
              </Button>
            </LabeledField>

            <LabeledField label="Placement">
              <Select
                aria-label="placement"
                options={[...placements]}
                value={placement}
                onChange={(e) => setPlacement(e.target.value as Placement)}
              />
            </LabeledField>

            <LabeledField label="Flip">
              <Button variant="secondary" onClick={() => setFlip((p) => !p)}>
                {flip ? "On" : "Off"}
              </Button>
            </LabeledField>

            <LabeledField label="Offset (px)">
              <Input
                aria-label="offset"
                type="number"
                value={String(offset)}
                onChange={(e) =>
                  setOffset(
                    Number.isFinite(Number(e.target.value))
                      ? Number(e.target.value)
                      : 0
                  )
                }
                style={{ width: 120 }}
              />
            </LabeledField>
          </ShowcaseRow>

          <ShowcaseRow vfx={{ justify: "between", width: "full" }}>
            <LabeledField label="Anchor X align">
              <Select
                aria-label="x-align"
                options={[...alignments]}
                value={xAlign}
                onChange={(e) => setXAlign(e.target.value as Alignment)}
              />
            </LabeledField>

            <LabeledField label="Anchor Y position">
              <Select
                aria-label="y-pos"
                options={[...verticalPositions]}
                value={yPos}
                onChange={(e) => setYPos(e.target.value as VerticalPosition)}
              />
            </LabeledField>

            <Box vfx={{ width: "fit" }}>
              <Box vfx={{ marginBottom: "xs", fontWeight: 5, fontSize: "s" }}>
                Tip
              </Box>
              <ui.span vfx={{ color: "muted" }}>
                Scroll the panel below to verify re-positioning.
              </ui.span>
            </Box>
          </ShowcaseRow>

          <Box
            vfx={{
              border: true,
              radius: "rounded",
              padding: "m",
              backgroundColor: "default",
              color: "default",
            }}
            style={{ height: 360, overflow: "auto" }}
          >
            <Box vfx={{ axis: "y", gap: "l" }}>
              <ui.div vfx={{ color: "muted" }}>Scroll area start</ui.div>

              <Box style={{ height: spacerHeight }} />

              <Box vfx={{ axis: "x", justify: xAlign, width: "full" }}>
                <Floating
                  anchor={anchor}
                  visible={enabled}
                  floatingContent={
                    <Box
                      vfx={{
                        axis: "y",
                        gap: "xs",
                        padding: "s",
                        radius: "rounded",
                        border: true,
                        shadow: "floating",
                        backgroundColor: "default",
                        color: "default",
                      }}
                      style={{ width: 220 }}
                    >
                      <Box vfx={{ fontWeight: 6 }}>Floating content</Box>
                      <Box vfx={{ color: "muted", fontSize: "s" }}>
                        placement={placement}, offset={offset}, flip=
                        {String(flip)}
                      </Box>
                    </Box>
                  }
                  placement={placement}
                  offset={offset}
                  flip={flip}
                  animateTo={{
                    style: { opacity: 1, transform: "translateY(0)" },
                  }}
                  animateFrom={{
                    style: { opacity: 0, transform: "translateY(-4px)" },
                  }}
                  transitionProperties={["opacity", "transform"]}
                />
              </Box>

              <Box style={{ height: 520 }} />

              <ui.div vfx={{ color: "muted" }}>Scroll area end</ui.div>
            </Box>
          </Box>
        </Box>
      </ShowcaseBlock>
    </Page>
  );
}

export { FloatingPage as default };
