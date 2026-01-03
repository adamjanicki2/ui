/**
 * Scroll to the element with the given id.
 *
 * @param id The id of the element to scroll to.
 * @param behavior Scroll behavior.
 * @returns Nothing.
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
    return;
  }
}
