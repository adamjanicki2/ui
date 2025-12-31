import { useState } from "react";
import { Prism as SyntaxHighlighter } from "react-syntax-highlighter";
import {
  oneLight as light,
  oneDark as dark,
} from "react-syntax-highlighter/dist/esm/styles/prism";
import "src/components/snippet.css";
import { Badge, Button, Box, Icon, ui, classNames } from "@adamjanicki/ui";
import { useTheme } from "src/hooks";
import { check, clipboard } from "@adamjanicki/ui/icons";

export type Props = {
  className?: string;
  children: string;
  lang?: string;
};

export default function Snippet({ className, children, lang = "tsx" }: Props) {
  const { theme } = useTheme();
  children = children.trim();
  const [copied, setCopied] = useState(false);

  const copyCode = () => {
    navigator.clipboard.writeText(children);
    setCopied(true);
    window.setTimeout(() => setCopied(false), 3000);
  };

  return (
    <Box
      vfx={{
        marginX: "auto",
        maxWidth: "full",
        width: "min",
        radius: "rounded",
        border: true,
        borderColor: "primary",
        shadow: "floating",
      }}
      className={classNames("snippet-container", className)}
    >
      <Box
        vfx={{
          axis: "x",
          align: "center",
          justify: "between",
          width: "full",
          paddingX: "s",
          paddingY: "xs",
          borderBottom: true,
          borderColor: "primary",
        }}
      >
        <ui.span vfx={{ fontSize: "s", fontWeight: 5 }}>{lang}</ui.span>
        {copied ? (
          <Badge vfx={{ axis: "x", align: "center", gap: "xs" }} type="success">
            <Icon icon={check} /> Copied
          </Badge>
        ) : (
          <Button
            vfx={{ axis: "x", align: "center", gap: "xs", paddingY: "xxs" }}
            onClick={copyCode}
            size="small"
            variant="secondary"
          >
            <Icon icon={clipboard} />
            Copy
          </Button>
        )}
      </Box>
      <ui.pre
        vfx={{ axis: "x", width: "full", margin: "none", padding: "s" }}
        style={{
          overflow: "scroll",
          maxHeight: "70vh",
        }}
      >
        <SyntaxHighlighter
          style={theme === "dark" ? dark : light}
          language={lang}
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
      </ui.pre>
    </Box>
  );
}
