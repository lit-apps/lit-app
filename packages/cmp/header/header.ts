import { html, css, LitElement } from "lit";
import { customElement, property } from 'lit/decorators.js';


/** 
 * A simple application header, with icon slot on the left, title in the center and action items on the right.
 */
@customElement('lapp-header')
export default class lappHeader extends LitElement {

  static override styles = css`
      :host {
        display: block;
        background-color: var(--lapp-header-background-color, var(--md-sys-color-surface));
        color: var(--lapp-header-text-color, var(--md-sys-color-on-surface));
      }

      header {
        height: 64px;
        padding: 0 4px 0 16px;
        display: flex;
        align-items: center;
        gap: 4px;
      }

      .headline {
        flex: 1;
        text-align: center;
        /* M3/Title Large */
        font-family: var(--md-sys-typescale-title-large-font-family-name, 'Roboto');
        font-style: var(--md-sys-typescale-title-large-font-family-style, normal);
        font-weight: var(--md-sys-typescale-title-large-font-weight, 400);
        font-size: var(--md-sys-typescale-title-large-font-size, 22px);
        letter-spacing: var(--md-sys-typescale-title-large-tracking, 0px);
        line-height: var(--md-sys-typescale-title-large-height, 28px);
        text-transform: var(--md-sys-typescale-title-large-text-transform, none);
        text-decoration: var(--md-sys-typescale-title-large-text-decoration, none);
      }

      ::slotted([slot="navigation-icon"]),
      ::slotted([slot="actions"]) {
        display: flex;
        align-items: center;
      }
    `;
  
  @property({ type: String }) name = 'Title';

  override render() {
    return html`
      <header>
        <slot name="navigation-icon"></slot>
        <div class="headline">
          <slot name="headline">${this.name}</slot>
        </div>
        <slot name="actions"></slot>
      </header>
    `;
  }

}

declare global {
  interface HTMLElementTagNameMap {
    'lapp-header': lappHeader;
  }
}
