/**
 * Scroll to the element with the given id
 * @param id the id of the element to scroll to
 * @param behavior behavior of the scroll
 */
export default function scrollToId(
  id: string,
  behavior?: ScrollBehavior
): void {
  try {
    // catch cases where hash is not a valid id
    const element = document.getElementById(id);
    if (element) {
      element.scrollIntoView({ behavior });
    }
  } catch {
    // do nothing
  }
}
