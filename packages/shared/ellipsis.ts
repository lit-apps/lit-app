/**
 * Truncates a string and adds an ellipsis ('...') if it exceeds the specified length.
 * @param str - The string to truncate.
 * @param maxLength - The maximum length of the string including the ellipsis.
 * @returns The truncated string with an ellipsis if it exceeds the maxLength.
 */
export default function ellipsis(str: string, maxLength: number = 40): string {
  if (str.length <= maxLength) {
    return str;
  }
  return str.slice(0, maxLength - 3) + '...';
}