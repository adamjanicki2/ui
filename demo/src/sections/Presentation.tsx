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
} from "src/codeSnippets";
import {
  Accordion,
  Alert,
  Animated,
  Box,
  Button,
  Carousel,
  Layer,
} from "@adamjanicki/ui";

export default function Presentation() {
  const [animatedOpen, setAnimatedOpen] = useState(false);
  const [layerOpen, setLayerOpen] = useState(false);

  return (
    <section id="layout-section">
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
          className="m-auto"
          style={{ width: "calc(min(100%, 512px))" }}
          drawers={[
            {
              label: "Success",
              content: (
                <Box layout={{ padding: "m", paddingTop: "none" }}>
                  <Alert type="success">We live in a Twilight World.</Alert>
                </Box>
              ),
            },
            {
              label: "Info",
              content: (
                <Box layout={{ padding: "m", paddingTop: "none" }}>
                  <Alert type="info">We live in a Twilight World.</Alert>
                </Box>
              ),
            },
            {
              label: "Error",
              content: (
                <Box layout={{ padding: "m", paddingTop: "none" }}>
                  <Alert type="error">We live in a Twilight World.</Alert>
                </Box>
              ),
            },
          ]}
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
        <Box layout={{ axis: "y", align: "center" }}>
          <Button
            className="w-fc mb2"
            onClick={() => setAnimatedOpen(!animatedOpen)}
          >
            {animatedOpen ? "Unanimate" : "Animate"} Alert
          </Button>
          <Animated
            keepMounted
            duration={0.8}
            animated={animatedOpen}
            animateTo={{
              style: { opacity: 1, transform: "rotate(0)" },
            }}
            animateFrom={{
              style: { opacity: 0, transform: "rotate(0.5turn)" },
            }}
            className="w-100"
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
          having a ton of random <code>div</code>s strewn across the page. But
          more than that, it makes my code more readable by exposing
          easier-to-understand props like <code>axis</code> to control the flex
          direction.
        </Para>
        <Box layout={{ axis: "y" }}>
          <Box
            layout={{
              axis: "x",
              align: "end",
              justify: "center",
              padding: "xs",
              gap: "xs",
            }}
            className="bordering"
          >
            <Box
              className="bordering"
              layout={{
                axis: "y",
                align: "center",
                justify: "center",
                padding: "m",
              }}
            >
              L
            </Box>
            <Box
              className="bordering"
              layout={{
                axis: "y",
                align: "center",
                justify: "center",
                padding: "xl",
              }}
            >
              XL
            </Box>
            <Box
              className="bordering"
              layout={{
                axis: "y",
                align: "center",
                justify: "center",
                padding: "xxl",
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
        <Carousel className="m-auto br3 white" autoplayInterval={5}>
          <Box className="pv6 bg-red f2 i tc">
            "We live in a twilight world"
          </Box>
          <Box className="pv6 bg-purple f2 i tc">
            "We live in a twilight world"
          </Box>
          <Box className="pv6 bg-blue f2 i tc">
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
        <Box layout={{ axis: "y", align: "center" }}>
          <Button className="w-fc mb2" onClick={() => setLayerOpen(true)}>
            Open layer
          </Button>
          {layerOpen && (
            <Layer onClose={() => setLayerOpen(false)}>
              <Box className="pa5 br3 bg-green fade">
                <h1>Hello!</h1>
              </Box>
            </Layer>
          )}
          <HiddenSnippet>{layerSnippet}</HiddenSnippet>
        </Box>
      </>
    </section>
  );
}
