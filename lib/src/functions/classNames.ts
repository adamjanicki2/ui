import type { ReadonlyableArray } from "../types/common";

/**
 * Reduce a list of class names into one string.
 *
 * @param classNames List of class names to concatenate.
 * @returns Single Aggregated string of class names.
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
