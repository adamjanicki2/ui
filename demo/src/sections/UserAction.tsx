import { useState } from "react";
import Heading from "src/components/Heading";
import Para from "src/components/Para";
import HiddenSnippet from "src/components/HiddenSnippet";
import {
  buttonSnippet,
  inputSnippet,
  linkSnippet,
  selectSnippet,
} from "src/codeSnippets";
import {
  Box,
  Button,
  IconInput,
  Input,
  Link,
  UnstyledButton,
  UnstyledLink,
  Select,
  TextArea,
} from "@adamjanicki/ui";

export default function UserAction() {
  const [inputValue, setInputValue] = useState("Here's looking at you, kid.");
  const [selectValue, setSelectValue] = useState("orange");

  const buttonAction = () => window.alert("You clicked me!");

  return (
    <section id="user-action-section">
      <Heading level={1}>User Action</Heading>
      <Para>
        I was trying to think of a good word for this heading; form wouldn't
        have been appropriate since links don't really fit into that set, even
        though the rest of the data input elements do. All components in this
        section allow users to give input or take action in one way or another.
      </Para>

      {/* Button */}
      <>
        <Heading level={2}>Button</Heading>
        <Para>
          One of the foundational elements in any site is a button, so I've
          tried my best to make a robust option that is highly customizable
          depending on the required use case.
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
          <UnstyledButton className="ma1" onClick={buttonAction}>
            Unstyled
          </UnstyledButton>
        </Box>
        <HiddenSnippet>{buttonSnippet}</HiddenSnippet>
      </>

      {/* Input */}
      <>
        <Heading level={2}>Input</Heading>
        <Para>
          I have 2 different types of inputs: one is a standard input with some
          basic styles applied on top; the other is an icon input, meaning you
          can choose to add an icon to the start or end. This is particularly
          useful when building a search bar input, or perhaps you'd like to have
          a clear button at the end of your input.
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
      </>

      {/* Link */}
      <>
        <Heading level={2}>Link</Heading>
        <Para>
          Perhaps the most important element in this whole library: links. They
          are so crucial to any app, and I always used to have to waste a lot of
          time setting up and overriding annoying default link styles. This link
          is meant to be <em>extremely</em> customizable: you can override the
          underlying link element from an anchor element <code>{"<a>"}</code> to
          something more complex, maybe react-router-dom's link element if
          you're working within a router context.
        </Para>
        <Box layout={{ axis: "x", align: "center" }} className="w-fc m-auto">
          <Link className="ma1" to="#link">
            Internal link
          </Link>
          <Link className="ma1" to="https://adamovies.com" external>
            External link
          </Link>
          <UnstyledLink className="ma1" to="#link">
            Unstyled link
          </UnstyledLink>
        </Box>
        <HiddenSnippet>{linkSnippet}</HiddenSnippet>
      </>

      {/* Select */}
      <>
        <Heading level={2}>Select</Heading>
        <Para>
          This select input was tricky to design given how much styling
          different browsers, I'm looking at you Safari, apply to the native
          select element. I've tried to mitigate the differences by manually
          adding a dropdown arrow and hiding the native dropdown, but it's not
          perfect because this means I had to wrap the select element in an
          extra <code>div</code> container to store the select itself and the
          arrow.
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
        <HiddenSnippet>{selectSnippet}</HiddenSnippet>
      </>
    </section>
  );
}
