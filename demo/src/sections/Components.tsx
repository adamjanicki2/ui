import Heading from "src/components/Heading";
import Para from "src/components/Para";
import HiddenSnippet from "src/components/HiddenSnippet";
import {
  alertSnippet,
  animatedSnippet,
  badgeSnippet,
  bannerSnippet,
  boxSnippet,
  burgerSnippet,
  buttonSnippet,
  carouselSnippet,
  clickOutsideSnippet,
  inputSnippet,
  layerSnippet,
  linkSnippet,
  spinnerSnippet,
} from "src/codeSnippets";
import {
  Alert,
  Animated,
  Badge,
  Banner,
  Box,
  Button,
  IconButton,
  Carousel,
  ClickOutside,
  IconInput,
  Input,
  Link,
  UnstyledButton,
  UnstyledLink,
  Select,
  TextArea,
  Spinner,
  Layer,
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

export default function Components() {
  const [animatedOpen, setAnimatedOpen] = useState(false);
  const [inputValue, setInputValue] = useState("Here's looking at you, kid.");
  const [selectValue, setSelectValue] = useState("orange");
  const [layerOpen, setLayerOpen] = useState(false);
  const [hamburgerOpen, setHamburgerOpen] = useState(false);
  const [clickOutsideText, setClickOutsideText] = useState("Click outside me!");
  const toggleHamburger = () => setHamburgerOpen(!hamburgerOpen);

  const buttonAction = () => window.alert("You clicked me!");

  return (
    <section id="components-section">
      <Heading level={1}>Components</Heading>
      <Para>
        Components are the main reason why I ended up creating this library in
        the first place: I wanted a set of reusable UI elements that look pretty
        solid and can standardize the way my sites look in the future, while
        also allowing for a high degree of customization.
        <br />
        <br />
        Below is a list of all components and examples for each; it{" "}
        <em>should</em> be current but no promises, so use at your own risk. The
        point of this library was fun, so I change it often, including terrible
        breaking changes, whatever best serves me and my apps! Now let's get
        into it.
      </Para>
      <Heading level={2}>Alert</Heading>
      <Para>
        Alerts can have different types: <code>static</code>, <code>info</code>,{" "}
        <code>success</code>, <code>warning</code>, and <code>error</code>. The
        content types are also used for the <code>Badge</code> and{" "}
        <code>Banner</code> components.
      </Para>
      <Box layout={{ axis: "y" }}>
        <Alert className="mv1" type="static">
          This is a static alert
        </Alert>
        <Alert className="mv1" type="info">
          This is an info alert
        </Alert>
        <Alert className="mv1" type="success">
          This is a success alert
        </Alert>
        <Alert className="mv1" type="warning">
          This is a warning alert
        </Alert>
        <Alert className="mv1" type="error">
          This is an error alert
        </Alert>
        <HiddenSnippet>{alertSnippet}</HiddenSnippet>
      </Box>
      <Heading level={2}>Animated</Heading>
      <Para>
        This is a simple wrapper component that allows you to perform animations
        on mount and unmount of a given element. I found it useful when
        designing a custom modal for one of my other sites that I wanted to fade
        in an out when the user entered or exited the state.
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
      <Heading level={2}>Badge</Heading>
      <Para>
        Like alerts, badges also come in different types, and is represented by
        the same TypeScript type. these are little symbols and are good
        indicators of status of a particular thing.
      </Para>
      <Box layout={{ axis: "x", align: "center" }} className="w-fc m-auto">
        <Badge className="ma1" type="static">
          Static
        </Badge>
        <Badge className="ma1" type="info">
          Info
        </Badge>
        <Badge className="ma1" type="success">
          Success
        </Badge>
        <Badge className="ma1" type="warning">
          Warning
        </Badge>
        <Badge className="ma1" type="error">
          Error
        </Badge>
      </Box>
      <HiddenSnippet>{badgeSnippet}</HiddenSnippet>
      <Heading level={2}>Banner</Heading>
      <Para>
        Banners are virtually the same as alerts, but are meant for the tops of
        pages and contain more important information. Therefore, they have a
        default style of <code>width: 100%</code> applied to them.{" "}
        <em>
          I've taken the liberty of hiding the overflow here, but you get the
          point.
        </em>
      </Para>
      <Box layout={{ axis: "y" }}>
        <Banner className="ma1" type="static">
          This is a static banner
        </Banner>
        <Banner className="ma1" type="info">
          This is an info banner
        </Banner>
        <Banner className="ma1" type="success">
          This is a success banner
        </Banner>
        <Banner className="ma1" type="warning">
          This is a warning banner
        </Banner>
        <Banner className="ma1" type="error">
          This is an error banner
        </Banner>
        <HiddenSnippet>{bannerSnippet}</HiddenSnippet>
      </Box>
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
            padding: "s",
            gap: "s",
          }}
          className="bordering"
        >
          <Box
            className="bordering"
            layout={{
              axis: "y",
              align: "center",
              justify: "center",
              padding: "l",
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
      <Heading level={2}>Button</Heading>
      <Para>
        One of the foundational elements in any site is a button, so I've tried
        my best to make a robust option that is highly customizable depending on
        the required use case.
      </Para>
      <Box
        layout={{ axis: "x", align: "center", justify: "center", wrap: true }}
      >
        <Button className="ma1" variant="primary" onClick={buttonAction}>
          Primary
        </Button>
        <Button className="ma1" variant="secondary" onClick={buttonAction}>
          Secondary
        </Button>
        <UnstyledButton className="ma1" to="#button">
          Unstyled
        </UnstyledButton>
        <IconButton className="ma1" icon="➕" onClick={buttonAction} />
      </Box>
      <HiddenSnippet>{buttonSnippet}</HiddenSnippet>
      <Heading level={2}>Carousel</Heading>
      <Para>
        I've wanted to build some sort of site that could show off a collage of
        pictures that I've been taking on recent trips. I figured it'd be cool
        to have the page segmeneted by trip, and each trip would have a carousel
        of images, which is why I needed this component. This one ended up being
        one of the more tricky things in this library to implement due to all of
        the complex CSS involved.
      </Para>
      <Carousel className="m-auto br3 white" autoplayInterval={5}>
        <Box className="pa6 bg-red f1 i tc">"We live in a twilight world"</Box>
        <Box className="pa6 bg-purple f1 i tc">
          "We live in a twilight world"
        </Box>
        <Box className="pa6 bg-blue f1 i tc">"We live in a twilight world"</Box>
      </Carousel>
      <HiddenSnippet>{carouselSnippet}</HiddenSnippet>
      <Heading level={2}>ClickOutside</Heading>
      <Para>
        One of my very favorite elements in the entire UI library is the click
        outside listener. Due to the non-trivial implementation, I had the most
        fun working on building one that works correct, <em>and</em> doesn't add
        an extra element to the DOM, just instead wraps your component with some
        extra hook magic and click listeners.
      </Para>
      <Box className="w-fc m-auto">
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
      </Box>
      <HiddenSnippet>{clickOutsideSnippet}</HiddenSnippet>
      <Heading level={2}>Hamburger</Heading>
      <Para>
        I've had a recent fascination with making a custom hamburger button
        after I realized how fun it is to mess around with the{" "}
        <code>transform</code> css property to create all sorts of different
        variants of buttons. I've started simple with just 7 different variants,
        which you can checkout below!
      </Para>
      <Box
        layout={{ axis: "x", align: "center", justify: "center", wrap: true }}
      >
        <DoubleSpin
          open={hamburgerOpen}
          onClick={toggleHamburger}
          className="ma1 red"
        />
        <DoubleFlip
          open={hamburgerOpen}
          onClick={toggleHamburger}
          className="ma1 orange"
        />
        <DoubleCross
          open={hamburgerOpen}
          onClick={toggleHamburger}
          className="ma1 yellow"
        />
        <TripleSpin
          open={hamburgerOpen}
          onClick={toggleHamburger}
          className="ma1 green"
        />
        <TripleFlip
          open={hamburgerOpen}
          onClick={toggleHamburger}
          className="ma1 blue"
        />
        <TripleFade
          open={hamburgerOpen}
          onClick={toggleHamburger}
          className="ma1"
          style={{ color: "#4B0082" }}
        />
        <TriplePrestige
          open={hamburgerOpen}
          onClick={toggleHamburger}
          className="ma1"
          style={{ color: "#7F00FF" }}
        />
      </Box>
      <HiddenSnippet>{burgerSnippet}</HiddenSnippet>
      <Heading level={2}>Input</Heading>
      <Para>
        I have 2 different types of inputs: one is a standard input with some
        basic styles applied on top; the other is an icon input, meaning you can
        choose to add an icon to the start or end. This is particularly useful
        when building a search bar input, or perhaps you'd like to have a clear
        button at the end of your input.
      </Para>
      <Box
        layout={{ axis: "x", align: "center", wrap: true }}
        className="w-fc m-auto"
      >
        <Box className="ma1">
          <Box className="fw5 f6 mb1">Uncontrolled</Box>
          <Input placeholder="Type something..." />
        </Box>
        <Box className="ma1">
          <Box className="fw5 f6 mb1">Controlled</Box>
          <Input
            placeholder="Type something..."
            value={inputValue}
            onChange={(e) => setInputValue(e.target.value)}
          />
        </Box>
        <Box className="ma1">
          <Box className="fw5 f6 mb1">Icon Input</Box>
          <IconInput
            startIcon={<span className="ml2">🔎</span>}
            inputProps={{ placeholder: "Search..." }}
          />
        </Box>
        <Box className="ma1">
          <Box className="fw5 f6 mb1">Area</Box>
          <TextArea placeholder="Type something..." />
        </Box>
      </Box>
      <HiddenSnippet>{inputSnippet}</HiddenSnippet>
      <Heading level={2}>Layer</Heading>
      <Para>
        The layer component is a simple wrapper that allows you to create a
        layer on top of your content. This is particularly useful when you want
        to create a modal or a dropdown menu that should cover the entire
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
      <Heading level={2}>Link</Heading>
      <Para>
        Perhaps the most important element in this whole library: links. They
        are so crucial to any app, and I always used to have to waste a lot of
        time setting up and overriding annoying default link styles. This link
        is meant to be <em>extremely</em> customizable: you can override the
        underlying link element from an anchor element <code>{"<a>"}</code> to
        something more complex, maybe react-router-dom's link element if you're
        working within a router context.
      </Para>
      <Box layout={{ axis: "x", align: "center" }} className="w-fc m-auto">
        <Link className="ma1" to="#link">
          Internal link
        </Link>
        <Link
          className="ma1"
          to="https://adamovies.com"
          target="_blank"
          rel="noreferrer"
        >
          External link →
        </Link>
        <UnstyledLink className="ma1" to="#link">
          Unstyled link
        </UnstyledLink>
      </Box>
      <HiddenSnippet>{linkSnippet}</HiddenSnippet>
      <Heading level={2}>Select</Heading>
      <Para>
        This select input was tricky to design given how much styling different
        browsers, I'm looking at you Safari, apply to the native select element.
        I've tried to mitigate the differences by manually adding a dropdown
        arrow and hiding the native dropdown, but it's not perfect because this
        means I had to wrap the select element in an extra <code>div</code>{" "}
        container to store the select itself and the arrow.
      </Para>
      <Box
        layout={{ axis: "x", align: "center", wrap: true }}
        className="m-auto w-fc"
      >
        <Box className="ma1">
          <Box className="fw5 f6 mb1">Uncontrolled</Box>
          <Select
            aria-label="select"
            options={["apple", "orange", "banana", "kiwi"]}
          />
        </Box>
        <Box className="ma1">
          <Box className="fw5 f6 mb1">Controlled</Box>
          <Select
            aria-label="select"
            options={["apple", "orange", "banana", "kiwi"]}
            onChange={(e) => setSelectValue(e.target.value)}
            value={selectValue}
          />
        </Box>
      </Box>
      <Heading level={2}>Spinner</Heading>
      <Para>
        The spinner was such a fun one to design: I had to go into Illustrator
        to first make a suitable svg for the spinner icon, and then from there
        it was some fun css animations!
      </Para>
      <Box layout={{ axis: "x", align: "center" }} className="m-auto w-fc">
        <Spinner className="ma1" />
        <Spinner style={{ height: 36, color: "red" }} className="ma1" />
        <Spinner style={{ height: 48, color: "blue" }} className="ma1" />
      </Box>
      <HiddenSnippet>{spinnerSnippet}</HiddenSnippet>
    </section>
  );
}
