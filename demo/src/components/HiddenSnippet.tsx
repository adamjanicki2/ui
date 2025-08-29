import { Animated, Button, Box } from "@adamjanicki/ui";
import { useState } from "react";
import Snippet, { type Props } from "src/components/Snippet";

export default function HiddenSnippet(props: Props) {
  const [show, setShow] = useState(false);
  return (
    <>
      <Box layout={{ axis: "x", justify: "end", width: "full" }}>
        <Button
          className="mv2"
          onClick={() => setShow(!show)}
          variant="secondary"
          size="small"
        >
          {show ? "Hide" : "Show"} Code
        </Button>
      </Box>
      <Animated
        layout={{ axis: "x", justify: "center" }}
        className="w-100"
        visible={show}
        animateTo={{ style: { opacity: 1 } }}
        animateFrom={{ style: { opacity: 0 } }}
      >
        <Snippet {...props} />
      </Animated>
    </>
  );
}
