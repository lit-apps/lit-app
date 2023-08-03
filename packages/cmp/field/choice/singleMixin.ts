import { LappCheckbox } from '../__checkbox/checkbox';

import { PropertyValues } from 'lit';
import { property } from 'lit/decorators.js';
import { Choice } from './choice';
import { AriaList } from './types';

// potential counter for fields without a name
let counter = 0;

type Constructor<T = {}> = abstract new (...args: any[]) => T;
export declare abstract class MultiChoiceMixinInterface {
	// Define the interface for the mixin
	isMulti: boolean
	selected: string
	listRole: AriaList
	choiceInputSelector: string
	_value: string;
	/**	
	 * the value of the please specify input
	 */
	specify: string;

	static isCodeSelected: (value: string, code: string) => boolean;

}
/**
 * MultiChoiceMixin - a mixin to be applied to multi choice fields (e.g. checkbox group)
 */
export const MultiChoiceMixin = <T extends Constructor<Choice>>(superClass: T) => {

	abstract class MultiChoiceMixinClass extends superClass {

		protected override readonly isMulti = false;
		protected override readonly choiceInputSelector = '[data-role=radio]';
		protected override readonly listRole = 'radiogroup';
		protected override _value!: string;

		protected static isCodeSelected = (value: string | undefined, code: string) => {
			return value && value === code + '';
		}
		@property() specify!: string;

		@property()
		set selected(value: string) {

			[...this._queryItems(this.choiceInputSelector) as NodeListOf<LappCheckbox>]
			.forEach(check => check.checked = value === check.value);

			this._value = value;
			this.requestUpdate();
		}

		/** selected is called when we set the value */
		get selected() {
			const value: string = this._selectedValues[0];
			return value || '';
		}

		override firstUpdated(_changedProperties: PropertyValues) {
			if (!this.name) {
				this.name = `${this.fieldName}${++counter}`;
			}
			super.firstUpdated(_changedProperties);
		}

		// override handlekeydown so as to allow native radio to handle arrow keys
		// override handleKeydown(event: KeyboardEvent) {
			// event.preventDefault();
		// }

		// we override updated as the super class causes an infinite loop
		// it checks for a change in getInput.value, which will all ways be true	
		protected override updated(_changedProperties: PropertyValues) {
			// Keep changedProperties arg so that subclasses may call it

		}


	};
	// Cast return type to your mixin's interface intersected with the superClass type
	return MultiChoiceMixinClass as unknown as Constructor<MultiChoiceMixinInterface> & T;
}

export default MultiChoiceMixin;

