import { useState } from "react";
import { Prism as SyntaxHighlighter } from "react-syntax-highlighter";
import { oneLight as light } from "react-syntax-highlighter/dist/esm/styles/prism";
import "src/components/snippet.css";
import { Badge, Button } from "@adamjanicki/ui";
import { classNames } from "@adamjanicki/ui/functions";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faCheck, faClipboard } from "@fortawesome/free-solid-svg-icons";

type Props = {
  className?: string;
  children: string;
};

const Snippet = ({ className, children }: Props) => {
  const [copied, setCopied] = useState(false);

  const copyCode = () => {
    navigator.clipboard.writeText(children);
    setCopied(true);
    setTimeout(() => setCopied(false), 3000);
  };

  return (
    <div className={classNames("snippet-container ba br2", className)}>
      <div className="flex justify-between items-center w-100 bb ph2 pv1">
        <p className="f6 fw5 ma0">tsx</p>
        {copied ? (
          <Badge className="flex items-center" type="success">
            <FontAwesomeIcon icon={faCheck} className="mr1" /> Copied
          </Badge>
        ) : (
          <Button
            onClick={copyCode}
            style={{ padding: "3px 6px" }}
            className="f6 fw6"
            variant="secondary"
          >
            <FontAwesomeIcon icon={faClipboard} className="mr1" />
            Copy
          </Button>
        )}
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
};

export default Snippet;
