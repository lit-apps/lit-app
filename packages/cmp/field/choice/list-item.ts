import { MdRadio } from '@material/web/radio/radio';
import { css, CSSResult, nothing } from "lit";
import { customElement, property } from 'lit/decorators.js';
import { classMap } from 'lit/directives/class-map.js';

import { ARIAMixinStrict } from '@material/web/internal/aria/aria.js';
import type { ListItemType } from '@material/web/list/internal/listitem/list-item';
import { literal, html as staticHtml, StaticValue } from 'lit/static-html.js';
import { LappListItem } from '../../list/list-item';

/**
 * Supported behaviors for a list item.
 */
export type A11yListItemType = ListItemType | 'a11y';


/**
 *  List item for choice
 * we need this to focus the input the the list-item is focused
 */

@customElement('lapp-choice-list-item')
export default class lappChoiceListItem extends
	LappListItem {

	static override styles = [
		...LappListItem.styles as CSSResult[],
		css`

		:host([data-variant=vertical]) md-item {
			flex-direction: column-reverse;
		}
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

		/** for print - we want denser layout */ 
		@media print {
			:host {
			--md-list-item-bottom-space: 4px;
			--md-list-item-top-space: 4px;
			--md-list-item-one-line-container-height: 48px.;
			}
		}
		`
	]


	@property() selector!: string;
	@property({ type: Boolean }) isMulti: boolean = false;

	/**
		* Sets the behavior of the list item, defaults to "text". Change to "link" or
		* "button" for interactive items.
		*/
	// @ts-expect-error - we are cheating with ListItemType
	@property() override type: A11yListItemType = 'a11y';

	get inputElement() {
		return this.querySelector(this.selector) as MdRadio;
	}

	constructor() {
		super();
		this.addEventListener('click', this.handleClick)
		// this.addEventListener('focus', this.onFocus)
	}


	async handleClick(_e: Event) {
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

	/**
		* Renders the root list item.
		* We need an additional type to make the list item interactive but not focusable
		*
		* @param content the child content of the list item.
		*/
	protected override renderListItem(content: unknown) {
		const isAnchor = this.type === 'link';
		let tag: StaticValue;
		switch (this.type) {
			case 'link':
				tag = literal`a`;
				break;
			case 'button':
				tag = literal`button`;
				break;
			default:
			case 'text':
				tag = literal`li`;
				break;
			case 'a11y':
				tag = literal`div`;
				break;

		}

		const isInteractive = this.type !== 'text' && this.type !== 'a11y';
		// TODO(b/265339866): announce "button"/"link" inside of a list item. Until
		// then all are "listitem" roles for correct announcement.
		const target = isAnchor && !!this.target ? this.target : nothing;
		// @ts-expect-error - isDisabled is private
		const isDisabled = this.isDisabled;
		const role = this.dataset.role || this.listItemRole || 'listitem';
		return staticHtml`
      <${tag}
        id="item"
				role=${role}
        tabindex="${isDisabled || !isInteractive ? -1 : 0}"
        ?disabled=${isDisabled}
        aria-selected=${(this as ARIAMixinStrict).ariaSelected || nothing}
        aria-checked=${(this as ARIAMixinStrict).ariaChecked || nothing}
        aria-expanded=${(this as ARIAMixinStrict).ariaExpanded || nothing}
        aria-haspopup=${(this as ARIAMixinStrict).ariaHasPopup || nothing}
        class="list-item ${classMap(this.getRenderClasses())}"
        href=${this.href || nothing}
        target=${target}
        @focus=${this.onFocus}
      >${content}</${tag}>
    `;
	}

	// override onFocus() {
	// 	setTimeout(() => {
	// 		this.inputElement.focus()
	// 	}, 10)
	// }

}

declare global {
	interface HTMLElementTagNameMap {
		'lapp-choice-list-item': lappChoiceListItem;
	}
}
