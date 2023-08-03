import { LappCheckbox } from '../__checkbox/checkbox';
import { PropertyValues } from 'lit';
import { property, state } from 'lit/decorators.js';
import { Choice } from './choice';
import { AriaList, OptionMulti } from './types';
type Constructor<T = {}> = abstract new (...args: any[]) => T;
export declare abstract class MultiChoiceMixinInterface {
	// Define the interface for the mixin
	isMulti: boolean
	exclusiveIsSelected: boolean
	options: OptionMulti[]
	selected: string[]
	listRole: AriaList
	choiceInputSelector: string
	_value: string[];
	/**	
	 * the value of the please specify input
	 */
	specify: {[key: string]: string};

	static isCodeSelected: (value: string[], code: string) => boolean;

}
/**
 * MultiChoiceMixin - a mixin to be applied to multi choice fields (e.g. checkbox group)
 */
export const MultiChoiceMixin = <T extends Constructor<Choice>>(superClass: T) => {


	abstract class MultiChoiceMixinClass extends superClass {

		protected override readonly isMulti = true;
		protected override readonly choiceInputSelector = '[data-role=checkbox]';
		protected override readonly listRole = 'listbox';
		protected override _value!: string[];

		protected static isCodeSelected = (value: string[] | undefined, code: string) => {
			return value && value.indexOf(code + '') > -1;
			// return false;
		}
		/**
			 * The options to render
			 */
		@property({ type: Array }) override options!: OptionMulti[];
		@property({ type: Object }) specify: string | {[key: string]: string} = {};

		@state() exclusiveIsSelected = false;

		@property()
		set selected(value: string[]) {
			
			[...this._queryItems(this.choiceInputSelector) as NodeListOf<LappCheckbox>]
			.forEach(check => check.checked = (value || []).indexOf(check.value) > -1 ) ;

			this._value = value;
			this.requestUpdate();
		}

		/** selected is called when we set the value */
		get selected() {
			const values = this._selectedValues;
			const exclusive = this.exclusiveCode;
			
			if (exclusive && values.indexOf(exclusive) > -1) {
				this.exclusiveIsSelected = true;
				return [exclusive];
			}
			this.exclusiveIsSelected = false;
			
			return values;
		}

		/**
		 * return exclusiveCode if exists
			 */
		get exclusiveCode() {
			return this?.options?.find(o => o.exclusive)?.code;
		}

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

