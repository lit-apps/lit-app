
/**
 * Compares two values for deep equality.
 * Handles objects, arrays, and primitive types.
 * Returns true if both values are equal, false otherwise.
 *
 * @param a - First value to compare
 * @param b - Second value to compare
 * @returns boolean indicating whether the two values are deeply equal
 */
export function deepEqual(a: any, b: any): boolean {
  if (a === b) return true;

  if (a && b && typeof a === 'object' && typeof b === 'object') {
    if (a.constructor !== b.constructor) return false;

    if (Array.isArray(a)) {
      const length = a.length;
      if (length !== b.length) return false;
      for (let i = length; i-- > 0;) {
        if (!deepEqual(a[i], b[i])) return false;
      }
      return true;
    }

    const keys = Object.keys(a);
    const length = keys.length;
    if (length !== Object.keys(b).length) return false;

    for (let i = length; i-- > 0;) {
      const key = keys[i];
      if (!Object.prototype.hasOwnProperty.call(b, key) || !deepEqual(a[key], b[key])) return false;
    }

    return true;
  }

  // true if both NaN, false otherwise
  return a !== a && b !== b;
}