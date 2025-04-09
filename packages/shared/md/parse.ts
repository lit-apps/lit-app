import DOMPurify from 'dompurify';
import { html, nothing, TemplateResult } from 'lit';
import { unsafeHTML } from 'lit/directives/unsafe-html.js';
import { marked } from './marked';
import cfg from './parseConfig';

const renderer = new marked.Renderer();

// Note(CG): have external links open in a new tab
const linkRenderer = renderer.link;
renderer.link = (token) => {
  const { href } = token;
  const localLink = href?.startsWith(`${location.protocol}//${location.hostname}`);
  const html = linkRenderer.call(renderer, token);
  return localLink ? html : html.replace(/^<a /, `<a target="_blank" rel="noreferrer noopener nofollow" `);
};

/**
 * safely parse markdown and render to lit-element template
 * @param  {String} markdown markdown string
 * @return {TemplateResult}          lit-element template result
 */
export default (markdown: string, config = cfg): TemplateResult => {
  if (!markdown) {
    return nothing as unknown as TemplateResult;
  }

  return html`
    ${unsafeHTML(sanitizeHTML(markdown, config))}
  `;
};

/**
 * Sanitizes the given markdown string by converting it to HTML and then purifying it.
 *
 * @param markdown - The markdown string to be sanitized.
 * @param config - Optional configuration object for DOMPurify. Defaults to `cfg`.
 * @returns The sanitized HTML string.
 */
export function sanitizeHTML(markdown: string, config = cfg): string {
  return DOMPurify.sanitize(marked(markdown, { renderer }) as string, config);
}

/**
 * Replaces placeholders in a string with corresponding values from a data object.
 * 
 * Placeholders are defined in the format {{key}} where 'key' is a property name in the data object.
 * If a placeholder's key is not found in the data object, the key itself is returned.
 * 
 * @param content - The string containing placeholders to be replaced
 * @param data - An object containing key-value pairs for replacement
 * @returns The content string with all placeholders replaced by their corresponding values
 * 
 * @example
 * ```
 * const result = replacePlaceholders("Hello, {{name}}!", { name: "World" });
 * // result: "Hello, World!"
 * ```
 */
export function replacePlaceholders(content: string, data: Record<string, string>) {
  return content.replace(/{{(\w+)}}/g, (_, key) => data[key] || key);
};