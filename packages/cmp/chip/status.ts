import { html, css, LitElement } from "lit";
import { customElement, property, state } from 'lit/decorators.js';
import { when } from 'lit/directives/when.js';

export type StatusTypeT = 'neutral' | 'warning' | 'error' | 'success' | undefined;

/**
 * An to display status, for instance in a grid
 *  
 */
@customElement('lapp-chip-status')
export class LappChipStatus extends LitElement {
  static override styles = css`
      :host {
        --_font-size: var(--lapp-chip-status-font-size, var(--font-size-small, 0.75rem));
        --_icon-font-size: var(--lapp-chip-status-icon-font-size, var(--font-size-medium, 1rem));
        display: inline-flex;
        align-items: center;
        font-size: var(--_font-size);
        padding: 0.1rem 0.2rem;
        border-radius: 0.2rem;
        color: var(--color-on-surface);
        background-color: var(--color-surface);
      }
     
     lapp-icon {
      margin-left: 0.2rem;
      height: var(--_icon-font-size);
      width: var(--_icon-font-size);
     } 

		:host([status=error]) {
			color: var(--color-on-error);
			background-color: var(--color-error);
		}
		:host([status=warning]) {
			color: var(--color-on-warning);
			background-color: var(--color-warning);
		}
		:host([status=success]) {
			color: var(--color-on-success);
			background-color: var(--color-success);
		}
    `;


  /**
  * An icon to override the default icon 
  */
  @property() icon!: string

  /**
   * The state this chip is in
   */
  
  @property({ reflect: true }) status: StatusTypeT = 'neutral';

  override render() {
    const status = this.status ?? 'neutral';
    const icon = this.icon ?? status === 'success' ? 'check' : status === 'error' ? 'error' : status === 'warning' ? 'warning' : '';
    return html`<slot></slot>${when(!!icon, () => html`<lapp-icon .icon=${icon}></lapp-icon>`)}`;
  }
}


declare global {
  interface HTMLElementTagNameMap {
    'lapp-chip-status': LappChipStatus;
  }
}
