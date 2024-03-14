import { css } from 'lit';
import {customElement} from 'lit/decorators.js';
import { form, label, alignMwc, page } from '@preignition/preignition-styles';

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
 * @slot subheader - slot to display under header
 * @slot body - slot to display as main body
 * @slot footer - slot to display as footer
 * @slot header-control - slot to display control(s) in header
 */
@customElement('lapp-entity-holder')
export class LappEntityHolder extends EntityHolder {
	static override styles = [
		...page,
		alignMwc,
		form, 
		label,
		css`
		:host {
			display: contents;
		}
		`
	]
  
}
