import { css } from 'lit';
import {customElement} from 'lit/decorators.js';
import { form, label,styleTypography, accessibility, icon } from '@preignition/preignition-styles';

import EntityHolder from './src/cmp/entity-holder';

declare global {
  interface HTMLElementTagNameMap {
    'lapp-entity-holder': LappEntityHolder;
  }
}

/**
 * @final
 * @suppress {visibility}
 */
@customElement('lapp-entity-holder')
export class LappEntityHolder extends EntityHolder {
	static override styles = [
		styleTypography,
		accessibility,
		icon,
		form, 
		label,
		css`
		:host {
			display: contents;
		}
		`
	]
  
}
