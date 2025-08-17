/**
 * Assert a value is defined
 *
 * @param value the value to assert presence of
 * @param message optional error message
 * @returns the present value
 */
export default function assertDefined<T>(
  value: T | undefined,
  message?: string
): T {
  if (value === undefined) {
    throw new Error(message || "Unexpected undefined value");
  }
  return value;
}
