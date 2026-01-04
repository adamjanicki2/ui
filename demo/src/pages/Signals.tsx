import Para from "src/components/Para";
import { alertSnippet, badgeSnippet, bannerSnippet } from "src/codeSnippets";
import { Alert, Badge, Banner, ui } from "@adamjanicki/ui";
import { ShowcaseBlock, ShowcaseRow } from "src/components/Showcase";
import Page from "src/components/Page";

const contentTypes = ["static", "info", "success", "warning", "error"] as const;

export default function Signals() {
  return (
    <Page title="Signals">
      <Para>
        This section includes all components that involve signaling information
        or other alerting to a user visually. This will typically be something
        important or attention grabbing, hence all most of the following
        components have varying levels of severity that can be used. I had a fun
        time coming up with the colors for each variant, as you'll see below.
      </Para>

      <ShowcaseBlock
        title="Alert"
        snippet={alertSnippet}
        description={
          <>
            Alerts can have different types: <ui.code>static</ui.code>,{" "}
            <ui.code>info</ui.code>, <ui.code>success</ui.code>,{" "}
            <ui.code>warning</ui.code>, and <ui.code>error</ui.code>. The
            content types are also used for the <ui.code>Badge</ui.code> and{" "}
            <ui.code>Banner</ui.code> components.
          </>
        }
      >
        <ShowcaseRow
          vfx={{ axis: "y", gap: "s", padding: "none", marginX: "auto" }}
          style={{
            width: `min(100%, 400px)`,
          }}
        >
          {contentTypes.map((type) => (
            <Alert key={type} type={type} vfx={{ width: "full" }}>
              This is a {type} alert
            </Alert>
          ))}
        </ShowcaseRow>
      </ShowcaseBlock>

      <ShowcaseBlock
        title="Badge"
        snippet={badgeSnippet}
        description={
          <>
            Like alerts, badges also come in different types, and is represented
            by the same TypeScript type. these are little symbols and are good
            indicators of status of a particular thing.
          </>
        }
      >
        <ShowcaseRow vfx={{ marginX: "auto", width: "fit" }}>
          {contentTypes.map((type) => (
            <Badge key={type} type={type}>
              <ui.span style={{ textTransform: "capitalize" }}>{type}</ui.span>
            </Badge>
          ))}
        </ShowcaseRow>
      </ShowcaseBlock>

      <ShowcaseBlock
        title="Banner"
        snippet={bannerSnippet}
        description={
          <>
            Banners are virtually the same as alerts, but are meant for the tops
            of pages and contain more important information. Therefore, they
            have a default style of <ui.code>width: 100%</ui.code> applied to
            them.{" "}
            <ui.em>
              I've taken the liberty of hiding the overflow here, but you get
              the point.
            </ui.em>
          </>
        }
      >
        <ShowcaseRow vfx={{ axis: "y", gap: "s" }}>
          {contentTypes.map((type) => (
            <Banner key={type} type={type}>
              This is a {type} banner
            </Banner>
          ))}
        </ShowcaseRow>
      </ShowcaseBlock>
    </Page>
  );
}
