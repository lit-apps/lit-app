/**
 * A switch controller to set advanced mode.
 * 
 * @element lapp-advanced-switch
 * 
 * @cssprop --color-surface-container-low - Background color of the switch container.
 * @cssprop --space-xx-small - Padding for the switch container.
 * @cssprop --lapp-advanced-switch-elevation-level - Elevation level of the switch.
 * @cssprop --color-on-surface - Color of the label text.
 * @cssprop --font-size-small - Font size of the label text.
 * @cssprop --md-switch-track-outline-width - Outline width of the switch track.
 * 
 * @fires AdvancedModeEvent - Dispatched when the switch is toggled.
 * 
 * @property {boolean} inList - Indicates if the switch is rendered in a list.
 * @property {string} label - Label text for the switch.

 */
import { AdvancedModeEvent, ConsumeAdvancedModeMixin } from '@lit-app/shared/context/advanced-mode-mixin.js';
import { IsNarrow } from '@lit-app/shared/controller';
import { MdSwitch } from '@material/web/switch/switch';
import { css, html, LitElement } from "lit";
import { customElement, property } from 'lit/decorators.js';
import('@material/web/switch/switch.js')
import('@material/web/elevation/elevation.js')
import('@vaadin/tooltip/vaadin-tooltip.js');
/**
 *  A switch controller to set advanced mode
 * 
 */
@customElement('lapp-advanced-switch')
export default class AdvancedModeSwitch extends ConsumeAdvancedModeMixin(LitElement) {
  private isNarrow = new IsNarrow(this);

  static override styles = css`

			:host {
				display: inline-flex;
				position: relative;
				border-radius: 9999px;
    		background: var(--color-surface-container-low);
				--md-elevation-level: var(--lapp-advanced-switch-elevation-level, 1);
			}
			
	 		/* https://github.com/material-components/material-web/issues/2748 */
			label {
				color: var(--color-on-surface);
				font-size: var(--font-size-small);
				padding-inline-start: 6px;
				padding-inline-end: 8px;
        padding-top: var(--space-xx-small);
        padding-bottom: var(--space-xx-small);
				line-height: 32px;
			}
		
			 md-switch {
				--md-switch-track-outline-width: 4px;
			}
		`;

  /**
   * true to indicate it renders in a list
   */
  @property({ type: Boolean, attribute: 'in-list' }) inList!: boolean
  @property() label = 'Advanced'


  override render() {
    if (this.inList || this.isNarrow.value) {
      return this.renderSwitch()
    }
    return html`
			<md-elevation></md-elevation>
			<label>
        ${this.renderSwitch()}
				${this.label}
			</label>
		`;
  }

  private renderSwitch() {
    return html`
    <vaadin-tooltip text="toggle advanced mode" .target=${this}></vaadin-tooltip>
    <md-switch 
      aria-label="toggle advanced mode" 
      .selected=${this.advancedMode} 
      @change=${this.onChange}></md-switch>`
  }

  private async onChange(e: Event & { target: MdSwitch }) {
    e.stopPropagation();
    const target = e.target;
    await this.updateComplete;
    this.dispatchEvent(new AdvancedModeEvent(target.selected));
  }
}

declare global {
  interface HTMLElementTagNameMap {
    'lapp-advanced-switch': AdvancedModeSwitch;
  }
}
