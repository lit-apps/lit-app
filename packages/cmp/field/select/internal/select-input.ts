import('@material/web/textfield/filled-text-field.js')
import('@material/web/menu/menu.js')
import('@material/web/chips/input-chip.js')
// import  {Select} from '@material/web/select/internal/select.js';
import { Select } from './select.js';

import { html, nothing } from 'lit';

import { SelectOption } from '@material/web/select/internal/shared.js';
import { property, query, state } from 'lit/decorators.js';

// @ts-expect-error  - we are cheating
export abstract class SelectInput extends Select {
	private _searchHasFocus = false; 

	@state() loading: boolean = false;
	
	// allow multiselection of items (TODO)
	@property({type: Boolean }) multiple: boolean = false;

	@query('#search') private readonly search!: HTMLInputElement|null;

	get searchValue() {
		return this.search?.value;
	}
	override renderLabel() {
		return html`<div id="label">
			<md-chip-set>
				${this.renderChips()}
			</md-chip-set>
			<input 
				id="search"
        @input=${this.onInput}
				@focus=${this.onFocus}
				@blur=${this.onBlur}
				>
		</div>
		`;
	}

  override handleFocus() {
		// we focus the search input
		if (!this._searchHasFocus) {
			this._searchHasFocus = true;
			this.search?.focus();
		}
		super.handleFocus();
  }

	private onFocus() {
		this._searchHasFocus = true;
	}

	private onBlur() {
		setTimeout(() => {
			this._searchHasFocus = false;
		}, 0)
	}

	private renderChips() {
		const selectedOptions = this.getSelectedOptions();
		if (!selectedOptions) {
			return nothing;
		}
		return selectedOptions.map(([option]) => this.renderChip(option));
	}

	protected renderChip(option: SelectOption) {
		return html`<md-input-chip 
			.label=${option.displayText} 
			remove-only
			@remove=${this.onRemove(option)}></md-input-chip>`;
	}

	private onRemove(option) {
		return async (e: Event) => {
			// we need to preventDefault to prevent the chip from being removed by the chip-set
			e.preventDefault();
			option.selected = false;
			await this.updateComplete;
			this.dispatchInteractionEvents()
		}
	}

	override renderMenuContent() {
		return html`${this.loading ? html`<slot name="loading"></slot>` : html`<slot></slot>`}`;
	}

	onInput() {
		this.dispatchEvent(new CustomEvent('search-input', { composed: true}))
	}


/**
 * Gets the selected options from the DOM, and updates the value and display
 * text to the first selected option's value and headline respectively.
 *
 * @return Whether or not the selected option has changed since last update.
 */
	override updateValueAndDisplayText() {
		// TODO: handle multiSelect
		if (this.search) {
			this.search.value = ''
		}
		return super.updateValueAndDisplayText();
		
	}

	/**
 * Selects a given option, deselects other options, and updates the UI.
 *
 * @return Whether the last selected option has changed.
 */
	override selectItem(item: SelectOption) {
		// TODO: handle multiSelect
		return super.selectItem(item);
	}

	
}
