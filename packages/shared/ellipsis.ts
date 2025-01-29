/**
 * Truncates a string and adds an ellipsis ('...') if it exceeds the specified maximum length.
 *
 * @param str - The string to be truncated.
 * @param maxLength - The maximum length of the string including the ellipsis. Defaults to 40.
 * @returns The truncated string with an ellipsis if it exceeds the maximum length.
 */
export function ellipsis(str: string, maxLength: number = 40): string {
  if (!str) {
    return '';
  }
  if (str.length <= maxLength) {
    return str;
  }
  return str.slice(0, maxLength - 3) + '...';
}