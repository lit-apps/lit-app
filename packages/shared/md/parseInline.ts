import { html, nothing } from 'lit';
import { unsafeHTML } from 'lit/directives/unsafe-html.js';
import {marked} from './marked';
import DOMPurify from 'dompurify';
import cfg from './parseConfig';


/**
 * safely parse markdown and render to lit-element template
 * @param  {String} markdown markdown string
 * @return {TemplateResult} lit-element template result
 */
export default (markdown: string, config = cfg) => {
  if (!markdown) {
    return nothing;
  }

  return html`
    ${unsafeHTML(DOMPurify.sanitize(marked.parseInline(markdown) as string, config))}
  `;
};
