/**
 * Assert a value is defined.
 *
 * @param value The value to assert presence of.
 * @param message Optional error message.
 * @returns The present value.
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
