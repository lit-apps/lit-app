/**
 * Converts an HTML string to plain text by setting the innerHTML of a temporary div element
 * and then retrieving its innerText.
 *
 * @param label - The HTML string to be converted to plain text. Defaults to an empty string.
 * @returns The plain text representation of the provided HTML string.
 */
const div = document.createElement('div');

export default (label: string = ''): string => {
  div.innerHTML = label;
  return div.innerText;
};
