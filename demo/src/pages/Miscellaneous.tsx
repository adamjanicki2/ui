import Para from "src/components/Para";
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
  Spinner,
  Icon,
  Avatar,
  ui,
  ErrorBoundary,
  Button,
  Link,
} from "@adamjanicki/ui";
import { ShowcaseBlock, ShowcaseRow } from "src/components/Showcase";
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
import * as icons from "@adamjanicki/ui/icons";
import { Tooltip } from "@adamjanicki/ui-extended";
import Page from "src/components/Page";

const defaultClickOutsideText = "Click outside me!";

export default function Miscellaneous() {
  const [hamburgerOpen, setHamburgerOpen] = useState(false);
  const [clickOutsideText, setClickOutsideText] = useState(
    defaultClickOutsideText
  );
  const toggleHamburger = () => setHamburgerOpen(!hamburgerOpen);

  const hamburgers = [
    { Component: DoubleSpin, className: "red" },
    { Component: DoubleFlip, className: "orange" },
    { Component: DoubleCross, className: "yellow" },
    { Component: TripleSpin, className: "green" },
    { Component: TripleFlip, className: "blue" },
    { Component: TripleFade, style: { color: "#4B0082" } },
    { Component: TriplePrestige, style: { color: "#7F00FF" } },
  ] as const;

  return (
    <Page title="Miscellaneous">
      <Para>
        Probably the most fun set of components, although{" "}
        <Link to="/presentation#animated">Animated</Link> and{" "}
        <Link to="/presentation#carousel">Carousel</Link> give this a run for
        its money, this set of miscellaneous components covers a few additional
        things I always found myself repeating in many different website builds.
        My OCD kicked in and I decided to spent a full weekend getting CSS
        transitions down for a handful of Hamburger animations.
      </Para>

      <ShowcaseBlock
        title="ClickOutside"
        snippet={clickOutsideSnippet}
        description={
          <>
            One of my very favorite elements in the entire UI library is the
            click outside listener. Due to the non-trivial implementation, I had
            the most fun working on building one that works correct,{" "}
            <em>and</em> doesn't add an extra element to the DOM, just instead
            wraps your component with some extra hook magic and click listeners.
          </>
        }
      >
        <Box vfx={{ width: "fit", marginX: "auto" }}>
          <ClickOutside
            onClickOutside={() => {
              setClickOutsideText("You clicked outside!");
              window.setTimeout(
                () => setClickOutsideText(defaultClickOutsideText),
                1000
              );
            }}
          >
            <Alert type="info">{clickOutsideText}</Alert>
          </ClickOutside>
        </Box>
      </ShowcaseBlock>

      <ShowcaseBlock
        title="Hamburger"
        snippet={burgerSnippet}
        description={
          <>
            I've had a recent fascination with making a custom hamburger button
            after I realized how fun it is to mess around with the{" "}
            <ui.code>transform</ui.code> css property to create all sorts of
            different variants of buttons. I've started simple with just 7
            different variants, which you can checkout below!
          </>
        }
      >
        <ShowcaseRow>
          {hamburgers.map(({ Component, ...rest }, i) => (
            <Component
              key={i}
              open={hamburgerOpen}
              onClick={toggleHamburger}
              {...rest}
            />
          ))}
        </ShowcaseRow>
      </ShowcaseBlock>

      <ShowcaseBlock
        title="Icon"
        description={
          <>
            I mainly needed to make this component to support using icons in the{" "}
            <Link to="#carousel">carousel</Link> component. But then I decided
            to make this a generically useable component, even if I currently
            have hardly any icons available for use. Rest assured that I'm going
            to be getting a free trial of Adobe Illustrator to try and make as
            many icons as I possibly can!
          </>
        }
      >
        <Box
          vfx={{
            axis: "x",
            align: "center",
            justify: "center",
            wrap: true,
            gap: "s",
          }}
        >
          {Object.entries(icons).map(([iconName, icon], i) => (
            <Tooltip
              offset={4}
              tooltipContent={
                <Box
                  vfx={{
                    fontSize: "xs",
                    fontWeight: 6,
                  }}
                >
                  {i + 1}: {iconName}
                </Box>
              }
              key={i}
            >
              <Icon icon={icon} size="l" vfx={{ color: "muted" }} />
            </Tooltip>
          ))}
        </Box>
      </ShowcaseBlock>

      <ShowcaseBlock
        title="Spinner"
        snippet={spinnerSnippet}
        description={
          <>
            The spinner was such a fun one to design: I had to go into
            Illustrator to first make a suitable svg for the spinner icon, and
            then from there it was some fun css animations!
          </>
        }
      >
        <ShowcaseRow vfx={{ width: "fit", marginX: "auto", wrap: false }}>
          <Spinner />
          <Spinner style={{ height: 36, color: "red" }} />
          <Spinner style={{ height: 48, color: "blue" }} />
        </ShowcaseRow>
      </ShowcaseBlock>

      <ShowcaseBlock
        title="Avatar"
        snippet={avatarSnippet}
        description={
          <>
            I often find myself remaking a component to render a user's profile
            picture or icon in many of my sites. This flexible component allows
            you to configure either a background image, or a letter icon.
          </>
        }
      >
        <ShowcaseRow vfx={{ width: "fit", marginX: "auto" }}>
          {"ABCDE".split("").map((username) => (
            <Avatar key={username} username={username} size="m" />
          ))}
          <Avatar
            backgroundImage="https://adamjanicki.xyz/images/logo512.png"
            username="A"
            size="m"
          />
        </ShowcaseRow>
      </ShowcaseBlock>

      <ShowcaseBlock
        title="Error Boundary"
        description={
          <>
            I still think it's crazy that even in 2025 we still have no choice
            but to make error boundary components with old class components due
            to lifecycle methods that don't exist in the "new" functional
            components. Either way, I ruined the cleanliness of my library by
            including this in here.
          </>
        }
      >
        <ErrorBoundary Fallback={Fallback}>
          <Box vfx={{ axis: "x", justify: "center", padding: "xs" }}>
            <Bomb />
          </Box>
        </ErrorBoundary>
      </ShowcaseBlock>
    </Page>
  );
}

function Fallback({ error, reset }: { error: Error; reset: () => void }) {
  return (
    <Alert type="error" vfx={{ axis: "y", gap: "s" }}>
      {error.toString()}{" "}
      <Button vfx={{ width: "fit" }} variant="secondary" onClick={reset}>
        Reset
      </Button>
    </Alert>
  );
}

function Bomb() {
  const [boom, setBoom] = useState(false);
  if (boom) throw new Error("I just blew up!");
  return <Button onClick={() => setBoom(true)}>Blow up</Button>;
}
