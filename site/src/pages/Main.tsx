import { importCss } from "src/codeSnippets";
import Header from "src/components/Heading";
import Para from "src/components/Para";
import Snippet from "src/components/Snippet";
import Components from "src/sections/Components";
import Functions from "src/sections/Functions";
import Hooks from "src/sections/Hooks";

const Main = () => (
  <div className="main-container">
    <h1 className="f1 tc">Welcome to my UI library.</h1>
    <p className="f3 fw5 tc dark-gray">
      This is a collection of React components that I use across my projects.
      <br />
      Checkout the docs and examples below to see what's available.
    </p>
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
    <Components />
    <Hooks />
    <Functions />
  </div>
);

export default Main;
