/**
 * Offsets to scroll to, relative to top left corner
 */
type InstantScrollToOptions = {
  /** Offset from top (y) */
  top: number;
  /** Offset from left (x) */
  left: number;
};

/**
 * Instantly scroll to a set of coordinates
 *
 * @param options offsets to target
 */
export default function instantScrollTo({ top, left }: InstantScrollToOptions) {
  const html = document.documentElement;
  const body = document.body;

  const htmlHadStyle = html.hasAttribute("style");
  const bodyHadStyle = body?.hasAttribute("style") || false;

  const htmlScrollBehavior = html.style.scrollBehavior;
  const bodyScrollBehavior = body?.style.scrollBehavior || "";

  html.style.scrollBehavior = "auto";
  if (body) body.style.scrollBehavior = "auto";

  window.scrollTo(left, top);

  if (htmlHadStyle) {
    html.style.scrollBehavior = htmlScrollBehavior;
  } else {
    html.removeAttribute("style");
  }

  if (body) {
    if (bodyHadStyle) {
      body.style.scrollBehavior = bodyScrollBehavior;
    } else {
      body.removeAttribute("style");
    }
  }
}
