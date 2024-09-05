import { Prism as SyntaxHighlighter } from "react-syntax-highlighter";
import { oneLight as light } from "react-syntax-highlighter/dist/esm/styles/prism";
import "src/components/snippet.css";
import { Button } from "src/lib";

type Props = {
  className?: string;
  children: string;
};

const Snippet = ({ className, children }: Props) => (
  <div className="pre bg-near-white ba b--black mv3">
    <div className="flex justify-between items-center w-100 bb ph2 pv1">
      <p className="f6 fw5 ma0">tsx</p>
      <Button
        variant="secondary"
        className="f7"
        corners="sharp"
        style={{ padding: "2px 4px" }}
        onClick={() => {
          navigator.clipboard.writeText(children);
          // setAlert({ type: "info", message: "Code copied to clipboard" });
        }}
      >
        Copy
      </Button>
    </div>
    <pre className="pa2 ma0">
      <SyntaxHighlighter
        // showLineNumbers
        // children={children ? String(children).replace(/\n$/, "") : ""}
        style={light}
        language="tsx"
        customStyle={{
          background: "none",
          backgroundColor: "transparent",
          padding: 0,
          margin: 0,
        }}
        className="no-bg"
      >
        {children}
      </SyntaxHighlighter>
    </pre>
  </div>
);

export default Snippet;
