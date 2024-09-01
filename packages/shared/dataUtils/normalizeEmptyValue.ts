/**
 * Normalizes an empty value by converting undefined or null to an empty string.
 * If the value is NaN, it is converted to a string representation.
 * @param value - The value to be normalized.
 * @returns The normalized value.
 */
export default function normalizeEmptyValue(value : any): string {
  if ([undefined, null].indexOf(value) >= 0) {
    return '';
  } else if (isNaN(value)) {
    return value.toString();
  } else {
    return value;
  }
}