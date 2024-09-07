import Snippet from "src/components/Snippet";
import Heading from "src/components/Heading";
import Para from "src/components/Para";
import { classNamesSnippet, scrollToIdSnippet } from "src/codeSnippets";
import { Link } from "@adamjanicki/ui";

export default function Functions() {
  return (
    <section id="functions-section">
      <Heading level={1}>Functions</Heading>
      <Para>
        This is currently the smallest section of the library; I currently only
        have one, scratch that, two entries in the list! This will likely expand
        in the future as I want to keep modularizing my libraries and sites and
        such.
      </Para>
      <Heading level={2}>classNames</Heading>
      <Para>
        There's a better and super popular package for doing this simple
        operation but I didn't want to have any dependencies so I built a simple
        function myself which combines classNames in a way that allows you to
        use ternaries and possibly supply <code>undefined</code> and{" "}
        <code>null</code> values.
      </Para>
      <Snippet>{classNamesSnippet}</Snippet>
      <Heading level={2}>scrollToId</Heading>
      <Para>
        Just while building this docs site, I actually refactors some exising
        logic from the <Link to="#useScrollToHash">useScrollToHash</Link> hook
        into a simple function that can be used anywhere in your code. It's a
        simple function that scrolls to an element with a specific ID.
      </Para>
      <Snippet>{scrollToIdSnippet}</Snippet>
    </section>
  );
}
