import Heading from "src/components/Heading";
import Para from "src/components/Para";
import HiddenSnippet from "src/components/HiddenSnippet";
import {
  avatarSnippet,
  burgerSnippet,
  clickOutsideSnippet,
  spinnerSnippet,
} from "src/codeSnippets";
import {
  Alert,
  Box,
  ClickOutside,
  Link,
  Spinner,
  Icon,
  Avatar,
  ui,
  ErrorBoundary,
  Button,
} from "@adamjanicki/ui";
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
import { Tooltip } from "@adamjanicki/ui-extended";

export default function Miscellaneous() {
  const [hamburgerOpen, setHamburgerOpen] = useState(false);
  const [clickOutsideText, setClickOutsideText] = useState("Click outside me!");
  const toggleHamburger = () => setHamburgerOpen(!hamburgerOpen);

  return (
    <ui.section id="miscellaneous-section">
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
        <Box vfx={{ width: "fit", marginX: "auto" }}>
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
          <ui.code>transform</ui.code> css property to create all sorts of
          different variants of buttons. I've started simple with just 7
          different variants, which you can checkout below!
        </Para>
        <Box
          vfx={{
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
          vfx={{
            axis: "x",
            align: "center",
            justify: "center",
            wrap: true,
            gap: "s",
          }}
        >
          {iconTypes.map((icon, i) => (
            <Tooltip
              offset={4}
              tooltipContent={
                <Box className="tooltip f7 fw6 br3" vfx={{ padding: "xs" }}>
                  {i + 1}: {icon}
                </Box>
              }
              key={i}
            >
              <Icon icon={icon} size="m" className="subtitle" />
            </Tooltip>
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
          vfx={{
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

      {/* Avatar */}
      <>
        <Heading level={2}>Avatar</Heading>
        <Para>
          I often find myself remaking a component to render a user's profile
          picture or icon in many of my sites. This flexible component allows
          you to configure either a background image, or a letter icon.
        </Para>
        <Box
          vfx={{
            axis: "x",
            align: "center",
            gap: "s",
            padding: "xs",
            width: "fit",
            marginX: "auto",
          }}
        >
          <Avatar username="A" size="m" />
          <Avatar username="B" size="m" />
          <Avatar username="C" size="m" />
          <Avatar username="D" size="m" />
          <Avatar username="E" size="m" />
          <Avatar
            backgroundImage="https://adamjanicki.xyz/images/logo512.png"
            username="A"
            size="m"
          />
        </Box>
        <HiddenSnippet>{avatarSnippet}</HiddenSnippet>
      </>

      {/* Error boundary */}
      <>
        <Heading level={2}>Error Boundary</Heading>
        <Para>
          I still think it's crazy that even in 2025 we still have no choice but
          to make error boundary components with old class components due to
          lifecycle methods that don't exist in the "new" functional components.
          Either way, I ruined the cleanliness of my library by including this
          in here.
        </Para>
        <ErrorBoundary Fallback={Fallback}>
          <Box vfx={{ axis: "x", justify: "center", padding: "xs" }}>
            <Bomb />
          </Box>
        </ErrorBoundary>
      </>
    </ui.section>
  );
}

const Fallback = ({ error, reset }: { error: Error; reset: () => void }) => {
  return (
    <Alert type="error" vfx={{ axis: "y", gap: "s" }}>
      {error.toString()}{" "}
      <Button vfx={{ width: "fit" }} variant="secondary" onClick={reset}>
        Reset
      </Button>
    </Alert>
  );
};

const Bomb = () => {
  const [boom, setBoom] = useState(false);
  if (boom) throw new Error("I just blew up!");
  return <Button onClick={() => setBoom(true)}>Blow up</Button>;
};
