import '@material/web/iconbutton/icon-button.js';
import { css, html, LitElement } from "lit";
import { customElement, property } from 'lit/decorators.js';

/**
 * `lapp-icon-button-star` is a custom web component that extends `LitElement`.
 * It represents a star icon button that can be toggled between starred and unstarred states.
 * 
 * @element lapp-icon-button-star
 * 
 * @property {boolean} starred - Indicates whether the item is starred.
 * @property {string} starredLabel - The label to display when the item is starred.
 * @property {string} label - The label to display when the item is not starred.
 * 
 * 
 * @example
 * ```html
 * <lapp-icon-button-star starred></lapp-icon-button-star>
 * ```
 */
@customElement('lapp-icon-button-star')
export default class lappWidgetStar extends LitElement {

  static override styles = css`
      :host {
        display: inline-flex;
      }
    `;

  /**
   * Indicates whether the item is starred.
   */
  @property({ type: Boolean }) selected!: boolean;
  /**
   * the label to use when the item is starred
   */
  @property() starredLabel!: string;
  /**
   * the label to use when the item is not starred
   */
  @property() label: string = 'This item is not starred - click to star';

  override render() {
    const label = this.selected ? this.starredLabel || this.label : this.label;
    return html`
      <md-icon-button 
        toggle
        ?selected=${this.selected}
        title=${label}
        aria-label=${label}>
        <lapp-icon no-fill>star</lapp-icon>
        <lapp-icon slot="selected">star</lapp-icon>
      </md-icon-button>
    `;
  }
}

declare global {
  interface HTMLElementTagNameMap {
    'lapp-icon-button-star': lappWidgetStar;
  }
}
