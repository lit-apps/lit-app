import { css } from 'lit';
import {customElement} from 'lit/decorators.js';
import { form, styleTypography, accessibility } from '@preignition/preignition-styles';

import {EntityHolder} from './src/entity-holder';

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
		form, 
		css`
		:host {
			display: contents;
		}
		`
	]
  
}
