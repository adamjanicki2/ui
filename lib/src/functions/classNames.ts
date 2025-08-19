/**
 * Reduce a list of classnames into one string
 *
 * @param classNames list of class names to concatenate
 * @returns single aggregated string of classnames
 */
export default function classNames(
  ...classNames: Array<string | null | undefined>
): string {
  return classNames
    .map((className) => className?.trim())
    .filter(Boolean)
    .join(" ");
}
