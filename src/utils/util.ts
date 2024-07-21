/**
 * Reduce a list of classnames into one string
 *
 * @param classNames list of class names to concatenate
 * @returns concatenated class names
 */
export function classNames(...classNames: (string | undefined)[]): string {
  return classNames.filter(Boolean).join(" ");
}
