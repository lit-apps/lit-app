import normalizeEmptyValue from "./normalizeEmptyValue.js";

/**
 * Compares two values and returns a number indicating their relative order.
 * 
 * @param a - The first value to compare.
 * @param b - The second value to compare.
 * @returns A negative number if `a` is less than `b`, a positive number if `a` is greater than `b`, or 0 if they are equal.
 */
export function compare(a: any, b: any) {
  a = normalizeEmptyValue(a);
  b = normalizeEmptyValue(b);

  if (a < b) {
    return -1;
  }
  if (a > b) {
    return 1;
  }
  return 0;
}