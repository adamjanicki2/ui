import Heading from "src/components/Heading";
import Para from "src/components/Para";
import HiddenSnippet from "src/components/HiddenSnippet";
import {
  burgerSnippet,
  clickOutsideSnippet,
  spinnerSnippet,
} from "src/codeSnippets";
import { Alert, Box, ClickOutside, Link, Spinner, Icon } from "@adamjanicki/ui";
import {
  DoubleCross,
  DoubleFlip,
  DoubleSpin,
  TripleFade,
  TripleFlip,
  TripleSpin,
  TriplePrestige,
} from "@adamjanicki/ui/components/Hamburger";
import { useState } from "react";
import { iconTypes } from "@adamjanicki/ui/components/Icon/icons";

export default function Miscellaneous() {
  const [hamburgerOpen, setHamburgerOpen] = useState(false);
  const [clickOutsideText, setClickOutsideText] = useState("Click outside me!");
  const toggleHamburger = () => setHamburgerOpen(!hamburgerOpen);

  return (
    <section id="miscellaneous-section">
      <Heading level={1}>Miscellaneous</Heading>
      <Para>
        Probably the most fun set of components, although{" "}
        <Link to="#animated">Animated</Link> and{" "}
        <Link to="#carousel">Carousel</Link> give this a run for its money, this
        set of miscellaneous components covers a few additional things I always
        found myself repeating in many different website builds. My OCD kicked
        in and I decided to spent a full weekend getting CSS transitions down
        for a handful of Hamburger animations.
      </Para>

      {/* ClickOutside */}
      <>
        <Heading level={2}>ClickOutside</Heading>
        <Para>
          One of my very favorite elements in the entire UI library is the click
          outside listener. Due to the non-trivial implementation, I had the
          most fun working on building one that works correct, <em>and</em>{" "}
          doesn't add an extra element to the DOM, just instead wraps your
          component with some extra hook magic and click listeners.
        </Para>
        <Box layout={{ width: "fit", marginX: "auto" }}>
          <ClickOutside
            onClickOutside={() => {
              setClickOutsideText("You clicked outside!");
              window.setTimeout(
                () => setClickOutsideText("Click outside!"),
                1000
              );
            }}
          >
            <Alert type="info">{clickOutsideText}</Alert>
          </ClickOutside>
        </Box>{" "}
        <HiddenSnippet>{clickOutsideSnippet}</HiddenSnippet>
      </>

      {/* Hamburger */}
      <>
        <Heading level={2}>Hamburger</Heading>
        <Para>
          I've had a recent fascination with making a custom hamburger button
          after I realized how fun it is to mess around with the{" "}
          <code>transform</code> css property to create all sorts of different
          variants of buttons. I've started simple with just 7 different
          variants, which you can checkout below!
        </Para>
        <Box
          layout={{
            axis: "x",
            align: "center",
            justify: "center",
            gap: "s",
            padding: "xs",
            wrap: true,
          }}
        >
          <DoubleSpin
            open={hamburgerOpen}
            onClick={toggleHamburger}
            className="red"
          />
          <DoubleFlip
            open={hamburgerOpen}
            onClick={toggleHamburger}
            className="orange"
          />
          <DoubleCross
            open={hamburgerOpen}
            onClick={toggleHamburger}
            className="yellow"
          />
          <TripleSpin
            open={hamburgerOpen}
            onClick={toggleHamburger}
            className="green"
          />
          <TripleFlip
            open={hamburgerOpen}
            onClick={toggleHamburger}
            className="blue"
          />
          <TripleFade
            open={hamburgerOpen}
            onClick={toggleHamburger}
            style={{ color: "#4B0082" }}
          />
          <TriplePrestige
            open={hamburgerOpen}
            onClick={toggleHamburger}
            style={{ color: "#7F00FF" }}
          />
        </Box>
        <HiddenSnippet>{burgerSnippet}</HiddenSnippet>
      </>

      {/* Icon */}
      <>
        <Heading level={2}>Icon</Heading>
        <Para>
          I mainly needed to make this component to support using icons in the{" "}
          <Link to="#carousel">carousel</Link> component. But then I decided to
          make this a generically useable component, even if I currently have
          hardly any icons available for use. Rest assured that I'm going to be
          getting a free trial of Adobe Illustrator to try and make as many
          icons as I possibly can!
        </Para>
        <Box
          layout={{
            axis: "x",
            align: "center",
            justify: "center",
            wrap: true,
            gap: "s",
          }}
        >
          {iconTypes.map((icon, i) => (
            <Box key={i} layout={{ axis: "y", align: "center", padding: "xs" }}>
              <span className="fw5 f6 mb1">{icon}</span>
              <Icon icon={icon} size={16} />
            </Box>
          ))}
        </Box>
      </>

      {/* Spinner */}
      <>
        <Heading level={2}>Spinner</Heading>
        <Para>
          The spinner was such a fun one to design: I had to go into Illustrator
          to first make a suitable svg for the spinner icon, and then from there
          it was some fun css animations!
        </Para>
        <Box
          layout={{
            axis: "x",
            align: "center",
            gap: "s",
            padding: "xs",
            width: "fit",
            marginX: "auto",
          }}
        >
          <Spinner />
          <Spinner style={{ height: 36, color: "red" }} />
          <Spinner style={{ height: 48, color: "blue" }} />
        </Box>
        <HiddenSnippet>{spinnerSnippet}</HiddenSnippet>
      </>
    </section>
  );
}
