import { html, css, LitElement, nothing } from "lit";
import { customElement, property, state } from 'lit/decorators.js';
import { classMap } from 'lit/directives/class-map.js';
import { MdRadio } from '@material/web/radio/radio';

import  { LappListItem } from '../../list/list-item';

/**
 *  List item for choice
 * we need this to focus the input the the list-item is focused
 */

@customElement('lapp-choice-list-item')
export default class lappChoiceListItem extends LappListItem {

	static override styles = [
		...LappListItem.styles,
		css`
		/** This is to allow list text to wrap */
		.label-text {
			white-space: initial;
		}
		md-item {
			gap: 4px;
		}

		/** Style item when re-ordering (host display is block, flex do not have any effect) */
		button#item {
			width: 100%;
		}
		`
	]


	@property() selector!: string;
	@property({ type: Boolean }) isMulti: boolean = false;

	get inputElement() {
		return this.querySelector(this.selector) as MdRadio;
	}

	constructor() {
		super();
		this.addEventListener('click', this.handleClick)
	}


	async handleClick(e: Event) {
		const checkbox = this.inputElement
		await checkbox.updateComplete
		if (this.disabled) {
			return
		}
		if (!this.isMulti) {
			checkbox.checked = true
		} else {

			checkbox.checked = !checkbox.checked
		}
		checkbox.dispatchEvent(new Event('change', { bubbles: true }))
	}

}

declare global {
	interface HTMLElementTagNameMap {
		'lapp-choice-list-item': lappChoiceListItem;
	}
}
