const sizes = {
  xxsmall: 1,
  xsmall: 2,
  small: 4,
  medium: 8,
  large: 16,
  xlarge: 32,
  xxlarge: 64,
} as const;

/**
 * Easier-to-read string values that map to a pixel size
 */
type SizeToken = keyof typeof sizes;

/**
 * String token or integer representing the size of something
 */
export type Size = SizeToken | number;

/**
 * Get a concrete pixel value
 *
 * @param size the size token or integer value for pixel size
 * @returns size as a pixel value
 */
export function getSizePixelValue(size: Size): number {
  if (typeof size === "number") {
    return size;
  }

  return sizes[size];
}
