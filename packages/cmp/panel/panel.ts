import { css, html, LitElement } from "lit";
import { customElement } from 'lit/decorators.js';

/**
 *  A simple panel to display content.
 * 
 * Used for instance when loading data
 */

@customElement('lapp-panel')
export default class lappPanel extends LitElement {

  static override styles = css`
      :host {
        display: block;
				max-width: min(900px, calc(100% - 150px));
				margin: 10vh auto;
				min-height: 300px;
				padding: 50px;
				box-shadow: var(--shadow-material);
			}

			:host(md-divider) {
				margin: var(--space-x-large) 0;
			}			
    `;

  override render() {
    return html`<slot></slot>
      
    `;
  }

}

declare global {
  interface HTMLElementTagNameMap {
    'lapp-panel': lappPanel;
  }
}
