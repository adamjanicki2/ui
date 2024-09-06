import Snippet from "src/components/Snippet";
import Heading from "src/components/Heading";
import Para from "src/components/Para";

export default function Hooks() {
  return (
    <section id="hooks-section">
      <Heading level={1}>Hooks</Heading>
      <Para>
        I remember the first time I ever saw a hook in React; I belive it took
        my a full year before I truly understood how they work. Now I can't
        imagine using the ancient class components! I have a decent amount of
        general lighweight hooks below; some of them can get pretty specific
        depending on my use cases for it.
      </Para>
      <Heading level={2}>useFocusTrap</Heading>
      <Heading level={2}>useMediaQuery</Heading>
      <Heading level={2}>useScrollLock</Heading>
      <Heading level={2}>useScrollToHash</Heading>
      <Heading level={2}>useWatchScroll</Heading>
      <Heading level={2}>useWindowResize</Heading>
    </section>
  );
}
