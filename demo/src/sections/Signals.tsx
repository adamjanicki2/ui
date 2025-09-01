import Heading from "src/components/Heading";
import Para from "src/components/Para";
import HiddenSnippet from "src/components/HiddenSnippet";
import { alertSnippet, badgeSnippet, bannerSnippet } from "src/codeSnippets";
import { Alert, Badge, Banner, Box, ui } from "@adamjanicki/ui";

export default function Signals() {
  return (
    <ui.section id="signals-section">
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
          Alerts can have different types: <ui.code>static</ui.code>,{" "}
          <ui.code>info</ui.code>, <ui.code>success</ui.code>,{" "}
          <ui.code>warning</ui.code>, and <ui.code>error</ui.code>. The content
          types are also used for the <ui.code>Badge</ui.code> and{" "}
          <ui.code>Banner</ui.code> components.
        </Para>
        <Box vfx={{ axis: "y" }}>
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
        <Box
          vfx={{
            axis: "x",
            align: "center",
            gap: "s",
            padding: "xs",
            marginX: "auto",
            width: "fit",
          }}
        >
          <Badge type="static">Static</Badge>
          <Badge type="info">Info</Badge>
          <Badge type="success">Success</Badge>
          <Badge type="warning">Warning</Badge>
          <Badge type="error">Error</Badge>
        </Box>
        <HiddenSnippet>{badgeSnippet}</HiddenSnippet>
      </>

      {/* Banner */}
      <>
        <Heading level={2}>Banner</Heading>
        <Para>
          Banners are virtually the same as alerts, but are meant for the tops
          of pages and contain more important information. Therefore, they have
          a default style of <ui.code>width: 100%</ui.code> applied to them.{" "}
          <ui.em>
            I've taken the liberty of hiding the overflow here, but you get the
            point.
          </ui.em>
        </Para>
        <Box vfx={{ axis: "y", gap: "s", padding: "xs" }}>
          <Banner type="static">This is a static banner</Banner>
          <Banner type="info">This is an info banner</Banner>
          <Banner type="success">This is a success banner</Banner>
          <Banner type="warning">This is a warning banner</Banner>
          <Banner type="error">This is an error banner</Banner>
          <HiddenSnippet>{bannerSnippet}</HiddenSnippet>
        </Box>
      </>
    </ui.section>
  );
}
