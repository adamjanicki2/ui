import Snippet from "src/components/Snippet";

const Main = () => (
  <div className="w-100 ph5" style={{ minHeight: "70vh" }}>
    <h1 id="welcome" className="f1 tc">
      Welcome to my UI library.
    </h1>
    <p className="f3 fw5 tc dark-gray">
      This is a collection of React components that I use across my projects.
      <br />
      Checkout the docs and examples below to see what's available.
    </p>
    <h1 id="components">Components</h1>
    <Snippet>
      {`import { Button } from "@adamjanicki/ui"
const App = () => (
  <div>
    <Button>Click me</Button> 
  </div>
)`}
    </Snippet>
    <h1 id="hooks">Hooks</h1>
    <h1 id="functions">Functions</h1>
  </div>
);

export default Main;
