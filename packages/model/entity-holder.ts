import { css } from 'lit';
import { customElement } from 'lit/decorators.js';
import page from '@lit-app/shared/styles/page.js';
import { form, label, padding, margin, gap, sticky } from '@lit-app/shared/styles';
import alignMwc from '@lit-app/shared/styles/patch/alignMwc.js';
import EntityHolder from './src/cmp/entity-holder';



declare global {
  interface HTMLElementTagNameMap {
    'lapp-entity-holder': LappEntityHolder;
  }
}

/**
 * Component holding an entity
 * 
 * @slot header - slot to display header
 * @slot sub-header - slot to display under header
 * @slot body - slot to display as main body
 * @slot footer - slot to display as footer
 * @slot footer-data - slot to display a footer when there is data
 * @slot footer-no-data - slot to display when there is no data
 */
@customElement('lapp-entity-holder')
export class LappEntityHolder extends EntityHolder {
	static override styles = [
		...page,
		alignMwc,
		form, 
		padding,
		margin,
		gap,
		label,
		sticky,
		css`
			:host {
				display: contents;
			}
		`
	]
  
}
