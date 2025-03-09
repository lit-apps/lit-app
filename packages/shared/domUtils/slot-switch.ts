import { css, html, LitElement, nothing } from "lit";
import { customElement, property } from 'lit/decorators.js';
import { ifDefined } from 'lit/directives/if-defined.js';


import '@material/web/button/outlined-button.js';
import '@material/web/button/text-button.js';
/**
 * A component fow switching slot content based on conditions. 
 * 
 * When the `condition` is true, display the default slot. 
 * When the `condition` is false, display `false` slot, and a button
 * for still displaying the default content on click
 */

@customElement('lapp-slot-switch')
export default class lappSlotSwitch extends LitElement {

  static override styles = css`
      :host {
        display: flex;
        align-items: flex-end;
        gap: var(--space-medium)
      }
    `;

  @property() label: string = 'show';
  @property() hideLabel: string = 'hide';
  @property({ type: Boolean }) condition: boolean = true;

  private _previousCondition!: Boolean
  override render() {
    const onClick = () => {
      this.condition = true;
      this._previousCondition = false
    }
    const name = this.condition === true ? undefined : 'false'
    return html`
      <slot name=${ifDefined(name)}></slot>
      <div>
      ${this.condition === false ?
        html`
        <md-text-button
          @click=${onClick}
          >${this.label}</md-text-button>` :
        nothing
      }
      ${this.condition === true && this._previousCondition === false ?
        html`
        <md-text-button
          @click=${() => this.condition = false}
          >${this.hideLabel}</md-text-button>` :
        nothing
      }
      </div>
    `;
  }

}

declare global {
  interface HTMLElementTagNameMap {
    'lapp-slot-switch': lappSlotSwitch;
  }
}
