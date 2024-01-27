import {
	createValidator
} from '@material/web/labs/behaviors/constraint-validation.js';
import { ListController, NavigableKeys } from '@material/web/list/internal/list-controller.js';
import { ListItem } from '@material/web/list/internal/list-navigation-helpers.js';
import { PropertyValues } from 'lit';
import { property, state } from 'lit/decorators.js';
import { Choice } from './choice';
import { AriaList, OptionMulti } from './types';
// import {
// 	CheckboxValidator,
// } from '@material/web/labs/behaviors/validators/checkbox-validator.js';
import { MultiValidator } from './multiValidator';
// import {
// 	TextFieldValidator
// } from '@material/web/labs/behaviors/validators/text-field-validator.js';
import { Validator } from '@material/web/labs/behaviors/validators/validator';
import { MdCheckbox } from '@material/web/checkbox/checkbox';

const NAVIGABLE_KEY_SET = new Set<string>(Object.values(NavigableKeys));

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
	specify: { [key: string]: string };

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
		declare protected  _value: string[];

		protected static isCodeSelected = (value: string[] | undefined, code: string) => {
			return value && value.indexOf(code + '') > -1;
		}

		private readonly listController = new ListController<ListItem>({
			isItem: (item: HTMLElement): item is ListItem =>
				item.hasAttribute('data-role'),
			getPossibleItems: () => [...this._queryItems(this.choiceInputSelector) as NodeListOf<MdCheckbox>],
			isRtl: () => getComputedStyle(this).direction === 'rtl',
			deactivateItem:
				(item) => {
					item.tabIndex = -1;
				},
			activateItem:
				(item) => {
					item.tabIndex = 0;
				},
			isNavigableKey: (key) => NAVIGABLE_KEY_SET.has(key),
			isActivatable: (item) => !item.disabled && item.type !== 'text',
		});

		/**
		 * The options to render
		 */
		@property({ type: Array }) override options!: OptionMulti[];
		@property({ type: Object }) specify: string | { [key: string]: string } = {};

		@state() exclusiveIsSelected = false;

		@property({type: Array})
		set selected(value: string[]) {
			value = this.syncSelected(value);
			[...this._queryItems(this.choiceInputSelector) as NodeListOf<MdCheckbox>]
				.forEach(check => check.checked = (value || []).indexOf(check.value) > -1);

			this.requestUpdate();
		}


		/** selected is called when we set the value */
		get selected() {
			const values = this._selectedValues;
			const exclusive = this.exclusiveCode;

			if (exclusive && values.indexOf(exclusive) > -1) {
				return [exclusive];
			}

			return values;
		}

		syncSelected(value: string[]) {
			const exclusive = this.exclusiveCode;
			if (exclusive) {
				const exclusiveIsSelected = value.indexOf(exclusive) > -1;
				if (exclusiveIsSelected) {
					value = [exclusive];
					this.exclusiveIsSelected = true;
				} else {
					this.exclusiveIsSelected = false;
				}
			}
			this._value = value;
			return value
		}
		/**
		 * return exclusiveCode if exists
			 */
		get exclusiveCode() {
			return this?.options?.find(o => o.exclusive)?.code;
		}

		protected override handleKeydown(event: KeyboardEvent) {
			return this.listController.handleKeydown(event);
		}

		// we override updated as the super class causes an infinite loop
		// it checks for a change in getInput.value, which will all ways be true	
		protected override updated(_changedProperties: PropertyValues) {
			// Keep changedProperties arg so that subclasses may call it

		}

		[createValidator](): Validator<unknown> {
			return new MultiValidator(() => this);
		}


	};
	// Cast return type to your mixin's interface intersected with the superClass type
	return MultiChoiceMixinClass as unknown as Constructor<MultiChoiceMixinInterface> & T;
}

export default MultiChoiceMixin;

