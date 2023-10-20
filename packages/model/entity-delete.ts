import { css } from 'lit';
import {customElement} from 'lit/decorators.js';
import { form, label, styleTypography, accessibility, icon, page, alignIcon } from '@preignition/preignition-styles';
import { Layouts, Alignment } from '@preignition/lit-flexbox-literals';
import { alignMwc, page, icon } from '@preignition/preignition-styles';
import EntityDelete from './src/cmp/entity-delete';

declare global {
  interface HTMLElementTagNameMap {
    'lapp-entity-delete': LappEntityDelete;
  }
}

/**
 * @final
 * @suppress {visibility}
 */
@customElement('lapp-entity-delete')
export default class LappEntityDelete extends EntityDelete {
	static override styles = [
		...page,
		form,
		css`
		:host {
			display: contents;
		}
		`
	]
  
}
