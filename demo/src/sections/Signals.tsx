import Heading from "src/components/Heading";
import Para from "src/components/Para";
import HiddenSnippet from "src/components/HiddenSnippet";
import { alertSnippet, badgeSnippet, bannerSnippet } from "src/codeSnippets";
import { Alert, Badge, Banner, Box } from "@adamjanicki/ui";

export default function Signals() {
  return (
    <section id="signals-section">
      <Heading level={1}>Signals</Heading>
      <Para>
        This section includes all components that involve signaling information
        or other alerting to a user visually. This will typically be something
        important or attention grabbing, hence all most of the following
        components have varying levels of severity that can be used. I had a fun
        time coming up with the colors for each variant, as you'll see below.
      </Para>

      {/* Alert */}
      <>
        <Heading level={2}>Alert</Heading>
        <Para>
          Alerts can have different types: <code>static</code>,{" "}
          <code>info</code>, <code>success</code>, <code>warning</code>, and{" "}
          <code>error</code>. The content types are also used for the{" "}
          <code>Badge</code> and <code>Banner</code> components.
        </Para>
        <Box layout={{ axis: "y" }}>
          <Alert className="mv1" type="static">
            This is a static alert
          </Alert>
          <Alert className="mv1" type="info">
            This is an info alert
          </Alert>
          <Alert className="mv1" type="success">
            This is a success alert
          </Alert>
          <Alert className="mv1" type="warning">
            This is a warning alert
          </Alert>
          <Alert className="mv1" type="error">
            This is an error alert
          </Alert>
          <HiddenSnippet>{alertSnippet}</HiddenSnippet>
        </Box>
      </>
      {/* Badge */}
      <>
        <Heading level={2}>Badge</Heading>
        <Para>
          Like alerts, badges also come in different types, and is represented
          by the same TypeScript type. these are little symbols and are good
          indicators of status of a particular thing.
        </Para>
        <Box layout={{ axis: "x", align: "center" }} className="w-fc m-auto">
          <Badge className="ma1" type="static">
            Static
          </Badge>
          <Badge className="ma1" type="info">
            Info
          </Badge>
          <Badge className="ma1" type="success">
            Success
          </Badge>
          <Badge className="ma1" type="warning">
            Warning
          </Badge>
          <Badge className="ma1" type="error">
            Error
          </Badge>
        </Box>
        <HiddenSnippet>{badgeSnippet}</HiddenSnippet>
      </>

      {/* Banner */}
      <>
        <Heading level={2}>Banner</Heading>
        <Para>
          Banners are virtually the same as alerts, but are meant for the tops
          of pages and contain more important information. Therefore, they have
          a default style of <code>width: 100%</code> applied to them.{" "}
          <em>
            I've taken the liberty of hiding the overflow here, but you get the
            point.
          </em>
        </Para>
        <Box layout={{ axis: "y" }}>
          <Banner className="ma1" type="static">
            This is a static banner
          </Banner>
          <Banner className="ma1" type="info">
            This is an info banner
          </Banner>
          <Banner className="ma1" type="success">
            This is a success banner
          </Banner>
          <Banner className="ma1" type="warning">
            This is a warning banner
          </Banner>
          <Banner className="ma1" type="error">
            This is an error banner
          </Banner>
          <HiddenSnippet>{bannerSnippet}</HiddenSnippet>
        </Box>
      </>
    </section>
  );
}
