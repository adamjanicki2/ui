import Snippet from "src/components/Snippet";
import Heading from "src/components/Heading";
import Para from "src/components/Para";
import {
  focusTrapSnippet,
  mediaQuerySnippet,
  scrollLockSnippet,
  scrollToHashSnippet,
  scrollSnippet,
  windowResizeSnippet,
} from "src/codeSnippets";
import { Link } from "@adamjanicki/ui";

export default function Hooks() {
  return (
    <section id="hooks-section">
      <Heading level={1}>Hooks</Heading>
      <Para>
        I remember the first time I ever saw a hook in React; I believe it took
        my a full year before I truly understood how they work. Now I can't
        imagine using the ancient class components! I have a decent amount of
        general lighweight hooks below; some of them can get pretty specific
        depending on my use cases for it.
      </Para>
      <Heading level={2}>useFocusTrap</Heading>
      <Para>
        The purpose of this hook is mainly for overlays, modals, and other such
        "hovering" objects where you want to trap focus within them to avoid
        tab-navigating outside of them. This hook is useful only if your needs
        require you do be super careful with accessibility. Otherwise, this hook
        is probably overkill for you!
      </Para>
      <Snippet>{focusTrapSnippet}</Snippet>
      <Heading level={2}>useMediaQuery</Heading>
      <Para>
        This hook is great for when you need to know the state of a media query
        in your component for use cases that require scripting instead of just
        css. I've used this hook for making responsive components and for
        conditionally rendering components based on the window size.
      </Para>
      <Snippet>{mediaQuerySnippet}</Snippet>
      <Heading level={2}>useScrollLock</Heading>
      <Para>
        Locking scroll on a webpage is one of the most simple needs yet one of
        the most challenging things to actually implement. On most desktops and
        and laptops, you only have to set the body overflow to hidden. However,
        on mobile devices, you have to do a bit more work to prevent the page
        from scrolling. This hook takes care of all of that annoying stuff for
        you.
      </Para>
      <Snippet>{scrollLockSnippet}</Snippet>
      <Heading level={2}>useScrollToHash</Heading>
      <Para>
        A lot of times you might need intra-page navigation. An example is this
        very site which has to many headings and subheadings that would be nice
        to link to. When active, this hook will read the hash from the URL and
        attempt to scroll to the element with the corresponding ID.
      </Para>
      <Snippet>{scrollToHashSnippet}</Snippet>
      <Heading level={2}>useScroll</Heading>
      <Para>
        In a few of my sites I've wanted to conditionally apply styles based on
        if the scroll height has reached a certain threshold. This hook is how I
        accomplish it by adding a scroll event listener to the window.
      </Para>
      <Snippet>{scrollSnippet}</Snippet>
      <Heading level={2}>useWindowResize</Heading>
      <Para>
        I recently built a{" "}
        <Link to="/react-playground" target="_blank" rel="noreferrer">
          React Playground
        </Link>{" "}
        where I needed to know the window size to adjust sizes of the editor and
        view panes. This hook is the infrastructure of how I ended up doing it.
      </Para>
      <Snippet>{windowResizeSnippet}</Snippet>
    </section>
  );
}
