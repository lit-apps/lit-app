import { css } from 'lit';
import {customElement} from 'lit/decorators.js';
import { form, label, page } from '@preignition/preignition-styles';
import margin from '@preignition/preignition-styles/margin';

import {EntityAccess} from './internal/entity';

declare global {
  interface HTMLElementTagNameMap {
    'lapp-entity-access': LappEntityAccess;
  }
}

/**
 * @final
 * @suppress {visibility}
 */
@customElement('lapp-access-entity')
export default class LappEntityAccess extends EntityAccess {
	static override styles = [
		...page,
		margin,
		form, 
		label,
		css`
		:host {
			display: contents;
		}
		`
	]
  
}
