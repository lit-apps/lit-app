import {  LitElement, html } from "lit";
import { property, state} from 'lit/decorators.js';
import { Select } from '../../select/internal/select';
import { HTMLEvent } from '../../../types';

/**
 * A select field, with the ability to enter text
 * (either to create new options, or to filter existing ones)
 */
 export abstract class TextfieldSelect extends Select {

	@state() searchText: string = '';
 
  protected onInput(e: HTMLEvent<HTMLInputElement>) {
		console.log('onInput', e.target.value);
		// this.searchText = e.target.value;

	}

	private override renderLabel() {
    // need to render &nbsp; so that line-height can apply and give it a
    // non-zero height
    return html`<input
        id="label"
        class="label"
				.value=${this.displayText || ''}
				@input=${this.onInput}
				></input>`;
  }

	/**
	 * Override handleKeydown to prevent typeahead behavior
	 */
	private override _handleKeydown(e: KeyboardEvent) {
		if (this.open || this.disabled || !this.menu) {
      return;
    }

    const typeaheadController = this.menu.typeaheadController;
    const isOpenKey =
        e.code === 'Space' || e.code === 'ArrowDown' || e.code === 'Enter';

    // Do not open if currently typing ahead because the user may be typing the
    // spacebar to match a word with a space
    if (!typeaheadController.isTypingAhead && isOpenKey) {
      e.preventDefault();
      this.open = true;
      return;
    }
		const isPrintableKey = e.key.length === 1;

    // Handles typing ahead when the menu is closed by delegating the event to
    // the underlying menu's typeaheadController
    if (isPrintableKey) {
      typeaheadController.onKeydown(e);
      e.preventDefault();

      const {lastActiveRecord} = typeaheadController;

      if (!lastActiveRecord) {
        return;
      }

      const hasChanged = this.selectItem(
          lastActiveRecord[TYPEAHEAD_RECORD.ITEM] as SelectOption);

      if (hasChanged) {
        // this.dispatchInteractionEvents();
      }
    }
	}
  
}

