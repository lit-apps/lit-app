import { LitElement, PropertyValues } from 'lit';
import { property, state } from 'lit/decorators.js'
import {  Writeable } from '../types';

const validity: Writeable<Partial<ValidityState>> = {
	customError: false,
	badInput: false,
	valueMissing: false,
	valid: true,
};

type Constructor<T = {}> = abstract new (...args: any[]) => T;
export declare class ValidationMixinInterface {
	required: boolean;
	validity: ValidityState;

	/**
	 * Sets the text field's native validation error message. This is used to
	 * customize `validationMessage`.
	 *
	 * When the error is not an empty string, the text field is considered invalid
	 * and `validity.customError` will be true.
	 *
	 * https://developer.mozilla.org/en-US/docs/Web/API/HTMLInputElement/setCustomValidity
	 *
	 * @param error The error message to display.
	 */
	setCustomValidity(message: string): void;

	/**
	 * Returns true if the element meets all constraint validations, and is therefore
	 * considered to be valid, or false if it fails any of them. 
	 * https://developer.mozilla.org/en-US/docs/Web/API/HTMLInputElement/checkValidity
	 */
	checkValidity(): boolean;

	/**
	 * Returns the native validation error message that would be displayed upon
	 * calling `reportValidity()`.
	 *
	 * https://developer.mozilla.org/en-US/docs/Web/API/HTMLObjectElement/validationMessage
	 */
	get validationMessage(): string;

}
/**
 * ValidationMixin A mixin that adds validation support to a LitElement
 * For now, it only adds a `prop` property
 */
export const ValidationMixin = <T extends Constructor<LitElement>>(superClass: T) => {

	abstract  class ValidationMixinClass extends superClass implements ValidationMixinInterface {

		_input: HTMLInputElement;

		value!: string | string[] 
		required!: boolean
		customValidity!: string

		constructor(..._args: any[]) {
			super();

			// we create a native input to use the native validation
			this._input = document.createElement('input');
		}

		override willUpdate(props: PropertyValues) {
			super.willUpdate(props);
			if (props.has('required')) {
				this._input.required = this.required;
			}
			if (props.has('value')) {
				this._input.value = Array.isArray(this.value) ? this.value.join(',') : this.value;
			}
			if (props.has('customValidity')) {
				this._input.setCustomValidity(this.customValidity);
			}
		}

		get validity() {
			return this._input.validity
		}
		
		/**
		 * Returns the native validation error message that would be displayed upon
		 * calling `reportValidity()`.
		 *
		 * https://developer.mozilla.org/en-US/docs/Web/API/HTMLObjectElement/validationMessage
		 */
		get validationMessage() {
			return this._input.validationMessage;
		}
	
	
		/**
		 * Sets the text field's native validation error message. This is used to
		 * customize `validationMessage`.
		 *
		 * When the error is not an empty string, the text field is considered invalid
		 * and `validity.customError` will be true.
		 *
		 * https://developer.mozilla.org/en-US/docs/Web/API/HTMLInputElement/setCustomValidity
		 *
		 * @param error The error message to display.
		 */
		setCustomValidity(error: string) {
			return this._input.setCustomValidity(error);
		}
	
	
		/**
		 * Returns true if the element meets all constraint validations, and is therefore
		 * considered to be valid, or false if it fails any of them. 
		 * https://developer.mozilla.org/en-US/docs/Web/API/HTMLInputElement/checkValidity
		 */
		checkValidity() {
			return this._input.checkValidity();
		}

		checkValidityAndDispatch() {
			const valid = this._input.checkValidity();
			let canceled = false;
			if (!valid) {
				canceled = !this.dispatchEvent(new Event("invalid", { cancelable: true }));
			}
			return { valid, canceled };
		}
	};
	// Cast return type to your mixin's interface intersected with the superClass type
	return ValidationMixinClass as unknown as Constructor<ValidationMixinInterface> & T;
}

export default ValidationMixin;

