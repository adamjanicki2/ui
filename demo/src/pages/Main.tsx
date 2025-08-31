import { Link, Box, Icon, ui } from "@adamjanicki/ui";
import { importCss } from "src/codeSnippets";
import Header from "src/components/Heading";
import Para from "src/components/Para";
import Snippet from "src/components/Snippet";
import Presentation from "src/sections/Presentation";
import Signals from "src/sections/Signals";
import UserAction from "src/sections/UserAction";
import Miscellaneous from "src/sections/Miscellaneous";

const Main = () => (
  <Box className="main-container" layout={{ width: "full" }}>
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
    <Presentation />
    <Signals />
    <UserAction />
    <Miscellaneous />
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
  </Box>
);

export default Main;
