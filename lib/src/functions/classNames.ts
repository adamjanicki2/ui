import type { ReadonlyableArray } from "../types/common";

/**
 * Reduce a list of classnames into one string
 *
 * @param classNames list of class names to concatenate
 * @returns single aggregated string of classnames
 */
export default function classNames(
  ...classNames: ReadonlyableArray<string | null | undefined>
): string | undefined {
  return (
    classNames
      .map((className) => className?.trim())
      .filter(Boolean)
      .join(" ") || undefined
  );
}
