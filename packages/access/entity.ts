import { css } from 'lit';
import {customElement} from 'lit/decorators.js';
import page from '@lit-app/shared/styles/page.js';
import { form } from '@lit-app/shared/styles';
import { label } from '@lit-app/shared/styles';
import { margin } from '@lit-app/shared/styles';

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
