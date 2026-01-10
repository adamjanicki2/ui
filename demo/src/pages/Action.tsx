import {
  Button,
  ButtonLink,
  Icon,
  IconButton,
  IconInput,
  Input,
  Link,
  Select,
  TextArea,
  ui,
  UnstyledButton,
  UnstyledLink,
} from "@adamjanicki/ui";
import { download, search } from "@adamjanicki/ui/icons";
import { useState } from "react";
import {
  buttonSnippet,
  inputSnippet,
  linkSnippet,
  selectSnippet,
} from "src/codeSnippets";
import Page from "src/components/Page";
import Para from "src/components/Para";
import {
  LabeledField,
  ShowcaseBlock,
  ShowcaseRow,
} from "src/components/Showcase";

export default function Action() {
  const [inputValue, setInputValue] = useState("Here's looking at you, kid.");
  const [selectValue, setSelectValue] = useState("orange");

  const buttonAction = () => window.alert("You clicked me!");

  return (
    <Page title="Action">
      <Para>
        I was trying to think of a good word for this heading; form wouldn't
        have been appropriate since links don't really fit into that set, even
        though the rest of the data input elements do. All components in this
        section allow users to give input or take action in one way or another.
      </Para>

      <ShowcaseBlock
        title="Button"
        snippet={buttonSnippet}
        description={
          <>
            One of the foundational elements in any site is a button, so I've
            tried my best to make a robust option that is highly customizable
            depending on the required use case.
          </>
        }
      >
        <ShowcaseRow>
          <Button variant="primary" onClick={buttonAction}>
            Primary
          </Button>
          <Button variant="secondary" onClick={buttonAction}>
            Secondary
          </Button>
          <UnstyledButton onClick={buttonAction}>Unstyled</UnstyledButton>
          <IconButton icon={download} size="m" onClick={buttonAction} />
        </ShowcaseRow>
      </ShowcaseBlock>

      <ShowcaseBlock
        title="Input"
        snippet={inputSnippet}
        description={
          <>
            I have 2 different types of inputs: one is a standard input with
            some basic styles applied on top; the other is an icon input,
            meaning you can choose to add an icon to the start or end. This is
            particularly useful when building a search bar input, or perhaps
            you'd like to have a clear button at the end of your input.
          </>
        }
      >
        <ShowcaseRow vfx={{ gap: "s", width: "fit", marginX: "auto" }}>
          <LabeledField label="Uncontrolled">
            <Input placeholder="Type something..." />
          </LabeledField>
          <LabeledField label="Controlled">
            <Input
              placeholder="Type something..."
              value={inputValue}
              onChange={(e) => setInputValue(e.target.value)}
            />
          </LabeledField>
          <LabeledField label="Icon Input">
            <IconInput
              startIcon={<Icon vfx={{ marginLeft: "s" }} icon={search} />}
              inputProps={{ placeholder: "Search..." }}
            />
          </LabeledField>
          <LabeledField label="Area">
            <TextArea placeholder="Type something..." />
          </LabeledField>
        </ShowcaseRow>
      </ShowcaseBlock>

      <ShowcaseBlock
        title="Link"
        snippet={linkSnippet}
        description={
          <>
            Perhaps the most important element in this whole library: links.
            They are so crucial to any app, and I always used to have to waste a
            lot of time setting up and overriding annoying default link styles.
            This link is meant to be <ui.em>extremely</ui.em> customizable: you
            can use it like a normal <ui.code>{"<a>"}</ui.code> element, or use
            it within my <ui.code>{"<Router>"}</ui.code> component for internal
            navigation.
          </>
        }
      >
        <ShowcaseRow vfx={{ gap: "m", width: "fit", marginX: "auto" }}>
          <Link to="#link">Internal link</Link>
          <Link to="https://adamovies.com" newTab>
            External link
          </Link>
          <UnstyledLink to="#link">Unstyled link</UnstyledLink>
          <ButtonLink to="#link">Button link</ButtonLink>
        </ShowcaseRow>
      </ShowcaseBlock>

      <ShowcaseBlock
        title="Select"
        snippet={selectSnippet}
        description={
          <>
            This select input was tricky to design given how much styling
            different browsers, I'm looking at you Safari, apply to the native
            select element. I've tried to mitigate the differences by manually
            adding a dropdown arrow and hiding the native dropdown, but it's not
            perfect because this means I had to wrap the select element in an
            extra <ui.code>div</ui.code> container to store the select itself
            and the arrow.
          </>
        }
      >
        <ShowcaseRow vfx={{ gap: "s", width: "fit", marginX: "auto" }}>
          <LabeledField label="Uncontrolled">
            <Select
              aria-label="select"
              options={["apple", "orange", "banana", "kiwi"]}
            />
          </LabeledField>
          <LabeledField label="Controlled">
            <Select
              aria-label="select"
              options={["apple", "orange", "banana", "kiwi"]}
              onChange={(e) => setSelectValue(e.target.value)}
              value={selectValue}
            />
          </LabeledField>
        </ShowcaseRow>
      </ShowcaseBlock>
    </Page>
  );
}
