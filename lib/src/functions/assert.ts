/**
 * Assert a condition
 *
 * @param predicate the condition to assert
 * @param message optional error message
 */
export default function assert<T>(predicate: T, message?: string): void {
  if (!predicate) {
    throw new Error(message || "Assertion error");
  }
}

/**
 * Assert a value is defined
 *
 * @param value the value to assert presence of
 * @param message optional error message
 * @returns the present value
 */
export function assertDefined<T>(value: T | undefined, message?: string): T {
  if (value === undefined) {
    throw new Error(message || "Unexpected undefined value");
  }
  return value;
}
