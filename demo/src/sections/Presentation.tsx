import { useState } from "react";
import Heading from "src/components/Heading";
import Para from "src/components/Para";
import HiddenSnippet from "src/components/HiddenSnippet";
import {
  accordionSnippet,
  animatedSnippet,
  boxSnippet,
  carouselSnippet,
  layerSnippet,
  modalSnippet,
} from "src/codeSnippets";
import {
  Accordion,
  Alert,
  Animated,
  Box,
  Button,
  Carousel,
  Layer,
  Modal,
  ui,
} from "@adamjanicki/ui";

export default function Presentation() {
  const [animatedOpen, setAnimatedOpen] = useState(false);
  const [layerOpen, setLayerOpen] = useState(false);
  const [modalOpen, setModalOpen] = useState(false);
  const [openDrawers, setOpenDrawers] = useState<Set<number>>(new Set());

  return (
    <ui.section id="layout-section">
      <Heading level={1}>Presentation</Heading>
      <Para>
        Perhaps the most foundational of the sections of components within my
        library, the layout and presentation components allow nice composition
        of different types of UI surfaces, from handling simple flexboxes to
        making modals with layers, this section has you covered. This
        technically should be split into two different sections; this combines
        layout and presentational parts.
      </Para>
      {/* Accordion */}
      <>
        <Heading level={2}>Accordion</Heading>
        <Para>
          Any webdev is going to know how insanely tricky it is to animate an
          accordion due to it being <em>(for the moment)</em> difficult to
          animate from 0 height to auto height. So this solution is inefficient
          performance wise, but it was still fun to work on solving since it's a
          tricky problem.
        </Para>
        <Accordion
          vfx={{ marginX: "auto" }}
          style={{ width: "calc(min(100%, 512px))" }}
          drawers={(["success", "info", "error"] as const).map((status, i) => ({
            label: status,
            content: (
              <Box vfx={{ padding: "m", paddingTop: "none" }}>
                <Alert type={status}>We live in a Twilight World.</Alert>
              </Box>
            ),
            open: openDrawers.has(i),
            onOpenChange: (open) =>
              setOpenDrawers((prev) => {
                const next = new Set(prev);
                if (open) {
                  next.add(i);
                } else {
                  next.delete(i);
                }
                return next;
              }),
          }))}
        />
        <HiddenSnippet>{accordionSnippet}</HiddenSnippet>
      </>
      {/* Animated */}
      <>
        <Heading level={2}>Animated</Heading>
        <Para>
          This is a simple wrapper component that allows you to perform
          animations on mount and unmount of a given element. I found it useful
          when designing a custom modal for one of my other sites that I wanted
          to fade in an out when the user entered or exited the state.
        </Para>
        <Box vfx={{ axis: "y", align: "center", gap: "s" }}>
          <Button
            vfx={{ width: "fit" }}
            onClick={() => setAnimatedOpen(!animatedOpen)}
          >
            {animatedOpen ? "Unanimate" : "Animate"} Alert
          </Button>
          <Animated
            keepMounted
            duration={1}
            visible={animatedOpen}
            animateTo={{
              style: { opacity: 1, transform: "rotate(0)" },
            }}
            animateFrom={{
              style: { opacity: 0, transform: "rotate(0.5turn)" },
            }}
            vfx={{ width: "full" }}
          >
            <Alert type="info">This is an animated alert!</Alert>
          </Animated>
          <HiddenSnippet>{animatedSnippet}</HiddenSnippet>
        </Box>
      </>
      {/* Box */}
      <>
        <Heading level={2}>Box</Heading>
        <Para>
          I wanted something to standardize the layouts of my pages instead of
          having a ton of random <ui.code>div</ui.code>s strewn across the page.
          But more than that, it makes my code more readable by exposing
          easier-to-understand props like <ui.code>axis</ui.code> to control the
          flex direction.
        </Para>
        <Box vfx={{ axis: "y" }}>
          <Box
            vfx={{
              axis: "x",
              align: "end",
              justify: "center",
              padding: "xs",
              gap: "xs",
              border: true,
              borderColor: "primary",
            }}
          >
            <Box
              vfx={{
                axis: "y",
                align: "center",
                justify: "center",
                padding: "m",
                border: true,
                borderColor: "primary",
              }}
            >
              L
            </Box>
            <Box
              vfx={{
                axis: "y",
                align: "center",
                justify: "center",
                padding: "xl",
                border: true,
                borderColor: "primary",
              }}
            >
              XL
            </Box>
            <Box
              vfx={{
                axis: "y",
                align: "center",
                justify: "center",
                padding: "xxl",
                border: true,
                borderColor: "primary",
              }}
            >
              XXL
            </Box>
          </Box>
        </Box>
        <HiddenSnippet>{boxSnippet}</HiddenSnippet>
      </>
      {/* Carousel */}
      <>
        <Heading level={2}>Carousel</Heading>
        <Para>
          I've wanted to build some sort of site that could show off a collage
          of pictures that I've been taking on recent trips. I figured it'd be
          cool to have the page segmeneted by trip, and each trip would have a
          carousel of images, which is why I needed this component. This one
          ended up being one of the more tricky things in this library to
          implement due to all of the complex CSS involved.
        </Para>
        <Carousel
          vfx={{ marginX: "auto", radius: "rounded" }}
          className="white"
          autoplayInterval={5}
        >
          <Box
            vfx={{ paddingY: "xxl", textAlign: "center", fontSize: "xl" }}
            className="bg-red"
          >
            "We live in a twilight world"
          </Box>
          <Box
            vfx={{ paddingY: "xxl", textAlign: "center", fontSize: "xl" }}
            className="bg-purple"
          >
            "We live in a twilight world"
          </Box>
          <Box
            vfx={{ paddingY: "xxl", textAlign: "center", fontSize: "xl" }}
            className="bg-blue"
          >
            "We live in a twilight world"
          </Box>
        </Carousel>
        <HiddenSnippet>{carouselSnippet}</HiddenSnippet>
      </>

      {/* Layer */}
      <>
        <Heading level={2}>Layer</Heading>
        <Para>
          The layer component is a simple wrapper that allows you to create a
          layer on top of your content. This is particularly useful when you
          want to create a modal or a dropdown menu that should cover the entire
          screen.
        </Para>
        <Box vfx={{ axis: "y", align: "center", gap: "s" }}>
          <Button vfx={{ width: "fit" }} onClick={() => setLayerOpen(true)}>
            Open layer
          </Button>
          {layerOpen && (
            <Layer onClose={() => setLayerOpen(false)}>
              <Box
                vfx={{ padding: "xl", radius: "rounded", shadow: "floating" }}
                className="bg-green"
              >
                <h1>Hello!</h1>
              </Box>
            </Layer>
          )}
          <HiddenSnippet>{layerSnippet}</HiddenSnippet>
        </Box>
      </>

      {/* Modal */}
      <>
        <Heading level={2}>Modal</Heading>
        <Para>
          Built as a simple wrapper on top of the lower-level Layer component,
          the Modal component seeks to provide an easy interface for commonly
          used modal design patterns, providing props for doing something on
          confirm and close.
        </Para>
        <Box vfx={{ axis: "y", align: "center", gap: "s" }}>
          <Button vfx={{ width: "fit" }} onClick={() => setModalOpen(true)}>
            Open Modal
          </Button>
          <Modal
            open={modalOpen}
            onClose={() => setModalOpen(false)}
            onConfirm={() => {}}
          >
            <Box>
              Welcome to my modal. You can put all sorts of stuff in here if
              you'd like.
            </Box>
          </Modal>
          <HiddenSnippet>{modalSnippet}</HiddenSnippet>
        </Box>
      </>
    </ui.section>
  );
}
