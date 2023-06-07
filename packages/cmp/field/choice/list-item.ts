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
	override focus() {
		this.inputElement?.focus();
	}

	/**
	 * Renders the root list item.
	 *
	 * @param content {unkown} the child content of the list item.
	 */
	 protected override renderListItem(content: unknown) {
		if (this.isMulti) {
			return super.renderListItem(content);
		}

		// we want radio to be directly under radiogroup  role. 
		// the parent class adds a li element, which is not needed for radio
		return html`
				<div
						id="item"
						tabindex=${this.disabled ? -1 : this.itemTabIndex}
						aria-selected=${(this as ARIAMixinStrict).ariaSelected || nothing}
						aria-checked=${(this as ARIAMixinStrict).ariaChecked || nothing}
						class="list-item ${classMap(this.getRenderClasses())}"
						@click=${this.onClick}
						@pointerenter=${this.onPointerenter}
						@pointerleave=${this.onPointerleave}
						@keydown=${this.onKeydown}
						>${content}</div>`;
	}
}

declare global {
	interface HTMLElementTagNameMap {
		'lapp-choice-list-item': lappChoiceListItem;
	}
}
