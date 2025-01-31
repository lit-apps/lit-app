import { css, html, LitElement, nothing } from "lit";
import { customElement, property } from 'lit/decorators.js';
import { ifDefined } from "lit/directives/if-defined.js";

export type BreadcrumbItemT = {
  /**
   * href of the link
   */
  href?: string
  /**
   * title of the link
   */
  title: string
}

/**
 * A simple breadcrumb component 
 * 
 * It is inspired from https://www.w3.org/WAI/ARIA/apg/patterns/breadcrumb/examples/breadcrumb/
 * 
 * @property {BreadcrumbItemT[]} items - list of items to display in the breadcrumb
 * 
 * @css --lapp-breadcrumb-background - background color of the breadcrumb
 * @css --lapp-breadcrumb-color - color of the breadcrumb
 * @css --lapp-breadcrumb-color-hover - color of the breadcrumb on hover
 */

@customElement('lapp-breadcrumb')
export default class lappBreadcrumb extends LitElement {

  static override styles = css`
      :host {
        display: block;
        --_lapp-breadcrumb-background: var(--lapp-breadcrumb-background, transparent);
        --_lapp-breadcrumb-color: var(--lapp-breadcrumb-color, var(--color-primary));
        --_lapp-breadcrumb-color-hover: var(--lapp-breadcrumb-color-hover, var(--color-on-primary-container));
      }

      nav {
        border-radius: 4px;
        margin: 0;
        color: var(--_lapp-breadcrumb-color);
        background-color: var(--_lapp-breadcrumb-background);
      }

      ol {
        margin: 0;
        padding-left: 0;
        list-style: none;
      }

      li {
        display: inline;
      }

      li + li::before {
        display: inline-block;
        margin: 0 .4em;
        transform: rotate(15deg);
        border-right: 0.1em solid currentcolor;
        height: 0.75em;
        content: "";
      }

      a {
        color: inherit;
        transition: var(--transition-quickly);
        color: inherit;
        outline-offset: 3px;
      }

      a:hover {
        color: var(--_lapp-breadcrumb-color-hover);
        text-decoration: none;
      }
      a:focus, a:focus-visible {
        outline: var(--md-focus-ring-color, var(--md-sys-color-secondary)) auto 2px;
        text-decoration: none;
      }
      
      [aria-current="page"] {
        text-decoration: none;
      }
    `;

  @property({ attribute: false }) items!: BreadcrumbItemT[];

  override render() {
    return html`
     <nav aria-label="Breadcrumb" class="breadcrumb">
       <ol>
        ${this.items?.map((item, index, items) => html`
        <li><a aria-current=${index === items.length - 1 ? 'page' : nothing as unknown as 'page'} href=${ifDefined(item.href)}>${item.title}</a></li>
        `)}
      </ol>
    </nav>
    `;
  }

}

declare global {
  interface HTMLElementTagNameMap {
    'lapp-breadcrumb': lappBreadcrumb;
  }
}
