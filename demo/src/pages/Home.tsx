import { importCss } from "src/codeSnippets";
import Heading from "src/components/Heading";
import Para from "src/components/Para";
import Snippet from "src/components/Snippet";
import { ui, Icon, Link } from "@adamjanicki/ui";
import { architect } from "@adamjanicki/ui/icons";
import { useDocumentTitle } from "src/hooks";

export default function Home() {
  useDocumentTitle("@adamjanicki/ui");

  return (
    <>
      <ui.h1 vfx={{ textAlign: "center", fontSize: "xxl" }}>
        Welcome to my UI library.
      </ui.h1>
      <ui.p
        vfx={{
          color: "muted",
          textAlign: "center",
          fontWeight: 5,
          fontSize: "l",
        }}
      >
        This is a collection of React components that I use across my projects.
        <ui.br />
        Check out the docs and examples below to see what's available.
      </ui.p>
      <Snippet lang="bash">npm install --save @adamjanicki/ui</Snippet>
      <Heading>Setup</Heading>
      <Para>
        There's a little bit of setup required before you can start using the
        library. I hate it when libraries force their styles on you; oftentimes
        it's nearly impossible to override them. Because of this, you need to
        explicitly import my stylesheet into your app. This way you can order it
        so your own stylesheets take precedence over mine. See below for an
        example.
      </Para>
      <Snippet>{importCss}</Snippet>
      <Heading>Categories</Heading>
      <ui.ul vfx={{ axis: "y", gap: "s" }}>
        <ui.li>
          <Link to="/presentation">Presentation</Link>
        </ui.li>
        <ui.li>
          <Link to="/signals">Signals</Link>
        </ui.li>
        <ui.li>
          <Link to="/action">Action</Link>
        </ui.li>
        <ui.li>
          <Link to="/miscellaneous">Miscellaneous</Link>
        </ui.li>
        <ui.li>
          <Link to="/floating">Floating</Link>
        </ui.li>
      </ui.ul>
      <Para>
        And that's it! I hope you find this fun little library useful. If you
        want to play around with any of these components, you can head over to
        my{" "}
        <Link to="/react-playground" target="_blank" rel="noreferrer">
          React Playground
        </Link>{" "}
        to see them in action and play around.
        <ui.br />
        <ui.br />
        Thanks,
        <ui.br />
        Adam
      </Para>
      <Icon
        icon={architect}
        size="xl"
        style={{ color: "var(--aui-link-color)" }}
      />
    </>
  );
}
