import Snippet from "src/components/Snippet";
import Heading from "src/components/Heading";
import Para from "src/components/Para";
import HiddenSnippet from "src/components/HiddenSnippet";
import { alertSnippet } from "src/codeSnippets";
import { Alert } from "@adamjanicki/ui";

export default function Components() {
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
      </div>
      <HiddenSnippet>{alertSnippet}</HiddenSnippet>
      <Heading level={2}>Animated</Heading>
      <Heading level={2}>Badge</Heading>
      <Heading level={2}>Banner</Heading>
      <Heading level={2}>Button</Heading>
      <Heading level={2}>ClickOutside</Heading>
      <Heading level={2}>Input</Heading>
      <Heading level={2}>Layer</Heading>
      <Heading level={2}>Link</Heading>
      <Heading level={2}>Select</Heading>
      <Heading level={2}>Spinner</Heading>
    </section>
  );
}
