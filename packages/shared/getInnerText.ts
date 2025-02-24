import { TemplateResult } from "lit";

const div = document.createElement('div');

/**
 * Converts an HTML string to plain text by setting the innerHTML of a temporary div element
 * and then retrieving its innerText.
 *
 * @param label - The HTML string to be converted to plain text. Defaults to an empty string.
 * @returns The plain text representation of the provided HTML string.
 */
export default (label: string | TemplateResult = ''): string => {
  if (typeof label === 'object' && label.strings && Array.isArray(label.strings)) {
    const template = document.createElement('template');
    template.innerHTML = label.strings.join('');
    div.innerHTML = template.innerHTML;
    return div.innerText;
  }
  div.innerHTML = label as string;
  return div.innerText;
};
