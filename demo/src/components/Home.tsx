import { importCss } from "src/codeSnippets";
import Header from "src/components/Heading";
import Para from "src/components/Para";
import Snippet from "src/components/Snippet";
import Link from "src/components/Link";
import { ui, Icon } from "@adamjanicki/ui";

export default function Home() {
  return (
  <>
    <ui.h1 className="f1 tc">Welcome to my UI library.</ui.h1>
    <ui.p className="f3 fw5 tc subtitle">
      This is a collection of React components that I use across my projects.
      <ui.br />
      Checkout the docs and examples below to see what's available.
    </ui.p>
    <Snippet lang="bash">npm install --save @adamjanicki/ui</Snippet>
    <Header level={1}>Setup</Header>
    <Para>
      There's a little bit of setup required before you can start using the
      library. I hate it when libraries force their styles on you; oftentimes
      it's nearly impossible to override them. Because of this, you need to
      explicitly import my stylesheet into your app. This way you can order it
      so your own stylesheets take precedence over mine. See below for an
      example.
    </Para>
    <Snippet>{importCss}</Snippet>
    <Header level={1}>Categories</Header>
    <ui.ul vfx={{ axis: "y", gap: "s" }}>
      <ui.li>
        <Link to="/presentation">Presentation</Link>
      </ui.li>
      <ui.li>
        <Link to="/signals">Signals</Link>
      </ui.li>
      <ui.li>
        <Link to="/user-action">User Action</Link>
      </ui.li>
      <ui.li>
        <Link to="/miscellaneous">Miscellaneous</Link>
      </ui.li>
    </ui.ul>
    <Para>
      And that's it! I hope you find this fun little library useful. If you want
      to play around with any of these components, you can head over to my{" "}
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
    <Icon icon="architect" size="xl" style={{ color: "#0070ff" }} />
  </>
);
}
