import Heading from "src/components/Heading";
import Para from "src/components/Para";
import HiddenSnippet from "src/components/HiddenSnippet";
import {
  alertSnippet,
  animatedSnippet,
  badgeSnippet,
  bannerSnippet,
  buttonSnippet,
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
  Button,
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
import { useState } from "react";

export default function Components() {
  const [animatedOpen, setAnimatedOpen] = useState(false);
  const [inputValue, setInputValue] = useState("Here's looking at you, kid.");
  const [selectValue, setSelectValue] = useState("orange");
  const [layerOpen, setLayerOpen] = useState(false);
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
      <div className="flex flex-column">
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
      </div>
      <Heading level={2}>Animated</Heading>
      <Para>
        This is a simple wrapper component that allows you to perform animations
        on mount and unmount of a given element. I found it useful when
        designing a custom modal for one of my other sites that I wanted to fade
        in an out when the user entered or exited the state.
      </Para>
      <div className="flex flex-column items-center">
        <Button
          className="w-fc mb2"
          onClick={() => setAnimatedOpen(!animatedOpen)}
        >
          {animatedOpen ? "Close" : "Open"} Animated Alert
        </Button>
        <Animated
          visible={animatedOpen}
          enter={{ style: { opacity: 1 } }}
          exit={{ style: { opacity: 0 } }}
          className="w-100"
        >
          <Alert type="info">This is an animated alert!</Alert>
        </Animated>
        <HiddenSnippet>{animatedSnippet}</HiddenSnippet>
      </div>
      <Heading level={2}>Badge</Heading>
      <Para>
        Like alerts, badges also come in different types, and is represented by
        the same TypeScript type. these are little symbols and are good
        indicators of status of a particular thing.
      </Para>
      <div className="flex items-center w-fc m-auto">
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
      </div>
      <HiddenSnippet>{badgeSnippet}</HiddenSnippet>
      <Heading level={2}>Banner</Heading>
      <Para>
        Banners are virtually the same as alerts, but are meant for the tops of
        pages and contain more important information. Therefore, they have a
        default style of <code>width: 100vw</code> applied to them.{" "}
        <em>
          I've taken the liberty of hiding the overflow here, but you get the
          point.
        </em>
      </Para>
      <div className="flex flex-column" style={{ overflow: "hidden" }}>
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
      </div>
      <Heading level={2}>Button</Heading>
      <Para>
        One of the foundational elements in any site is a button, so I've tried
        my best to make a robust option that is highly customizable depending on
        the required use case.
      </Para>
      <div className="flex items-center justify-center flex-wrap">
        <Button className="ma1" variant="primary">
          Primary
        </Button>
        <Button className="ma1" variant="secondary">
          Secondary
        </Button>
        <Button className="ma1" variant="transparent">
          Transparent
        </Button>
        <UnstyledButton className="ma1">Unstyled</UnstyledButton>
      </div>
      <HiddenSnippet>{buttonSnippet}</HiddenSnippet>
      <Heading level={2}>ClickOutside</Heading>
      <Para>
        One of my very favorite elements in the entire UI library is the click
        outside listener. Due to the non-trivial implementation, I had the most
        fun working on building one that works correct, <em>and</em> doesn't add
        an extra element to the DOM, just instead wraps your component with some
        extra hook magic and click listeners.
      </Para>
      <div className="w-fc m-auto">
        <ClickOutside onClickOutside={() => console.log("You did it!")}>
          <Alert type="info">Click outside me! (Check the console)</Alert>
        </ClickOutside>
      </div>
      <HiddenSnippet>{clickOutsideSnippet}</HiddenSnippet>
      <Heading level={2}>Input</Heading>
      <Para>
        I have 2 different types of inputs: one is a standard input with some
        basic styles applied on top; the other is an icon input, meaning you can
        choose to add an icon to the start or end. This is particularly useful
        when building a search bar input, or perhaps you'd like to have a clear
        button at the end of your input.
      </Para>
      <div className="flex items-center w-fc m-auto flex-wrap">
        <div className="ma1">
          <div className="fw5 f6">Uncontrolled</div>
          <Input placeholder="Type something..." className="bg-white" />
        </div>
        <div className="ma1">
          <div className="fw5 f6">Controlled</div>
          <Input
            placeholder="Type something..."
            className="bg-white"
            value={inputValue}
            onChange={(e) => setInputValue(e.target.value)}
          />
        </div>
        <div className="ma1">
          <div className="fw5 f6">Icon Input</div>
          <IconInput
            startIcon={<span className="ml2">🔎</span>}
            inputProps={{ placeholder: "Search..." }}
            className="bg-white"
          />
        </div>
        <div className="ma1">
          <div className="fw5 f6">Icon Input</div>
          <TextArea className="bg-white" placeholder="Type something..." />
        </div>
      </div>
      <HiddenSnippet>{inputSnippet}</HiddenSnippet>
      <Heading level={2}>Layer</Heading>
      <Para>
        The layer component is a simple wrapper that allows you to create a
        layer on top of your content. This is particularly useful when you want
        to create a modal or a dropdown menu that should cover the entire
        screen.
      </Para>
      <div className="flex flex-column items-center">
        <Button className="w-fc mb2" onClick={() => setLayerOpen(true)}>
          Open layer
        </Button>
        {layerOpen && (
          <Layer onClose={() => setLayerOpen(false)}>
            <div className="pa5 br3 bg-white fade">
              <h1>Hello!</h1>
            </div>
          </Layer>
        )}
        <HiddenSnippet>{layerSnippet}</HiddenSnippet>
      </div>
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
      <div className="flex items-center w-fc m-auto">
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
      </div>
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
      <div className="flex items-center m-auto w-fc flex-wrap">
        <div className="ma1">
          <div className="fw5 f6">Uncontrolled</div>
          <Select
            aria-label="select"
            options={["apple", "orange", "banana", "kiwi"]}
            innerClassName="bg-white"
          />
        </div>
        <div className="ma1">
          <div className="fw5 f6">Controlled</div>
          <Select
            aria-label="select"
            options={["apple", "orange", "banana", "kiwi"]}
            onChange={(e) => setSelectValue(e.target.value)}
            value={selectValue}
            innerClassName="bg-white"
          />
        </div>
      </div>
      <Heading level={2}>Spinner</Heading>
      <Para>
        The spinner was such a fun one to design: I had to go into Illustrator
        to first make a suitable svg for the spinner icon, and then from there
        it was some fun css animations!
      </Para>
      <div className="flex items-center m-auto w-fc">
        <Spinner className="ma1" />
        <Spinner style={{ height: 36, color: "red" }} className="ma1" />
        <Spinner style={{ height: 48, color: "blue" }} className="ma1" />
      </div>
      <HiddenSnippet>{spinnerSnippet}</HiddenSnippet>
    </section>
  );
}
