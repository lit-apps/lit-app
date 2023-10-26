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
 */
export const ValidationMixin = <T extends Constructor<LitElement>>(superClass: T & {internals: ElementInternals}) => {

	abstract  class ValidationMixinClass extends superClass implements ValidationMixinInterface {

		static formAssociated = true;
		private _input: HTMLInputElement;
		private internals!: ElementInternals;

		value!: string | string[] 
		required!: boolean
		// customValidity!: string

		constructor(..._args: any[]) {
			super();

			// we create a native input to use the native validation
			this._input = document.createElement('input');
		}

		override connectedCallback() {
			super.connectedCallback();
			if(!this.internals) {
				this.internals = this.attachInternals();
			}
		}

		override willUpdate(props: PropertyValues) {
			super.willUpdate(props);
			if (props.has('required')) {
				this._input.required = this.required;
			}
			if (props.has('value')) {
				const value = Array.isArray(this.value) ? this.value.join(',') : this.value;
				this._input.value = value
			}
			// if (props.has('customValidity')) {
			// 	this.setCustomValidity(this.customValidity);
			// }
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
		setCustomValidity(error: string = '') {
			this._input.setCustomValidity(error);
			this.internals?.setValidity( {customError: !!error}, error);
		}
	
	
		/**
		 * Returns true if the element meets all constraint validations, and is therefore
		 * considered to be valid, or false if it fails any of them. 
		 * https://developer.mozilla.org/en-US/docs/Web/API/HTMLInputElement/checkValidity
		 */
		checkValidity() {
			return this._input.checkValidity();
		}

		// checkValidityAndDispatch() {
		// 	const valid = this._input.checkValidity();
		// 	let canceled = false;
		// 	if (!valid) {
		// 		canceled = !this.dispatchEvent(new Event("invalid", { cancelable: true }));
		// 	}
		// 	return { valid, canceled };
		// }

		syncValidity() {
			// Sync the internal <input>'s validity and the host's ElementInternals
			// validity. We do this to re-use native `<input>` validation messages.
			const input = this._input
			if (this.internals.validity.customError) {
				input.setCustomValidity(this.internals.validationMessage);
			} else {
				input.setCustomValidity('');
			}
	
			this.internals.setValidity(input.validity, input.validationMessage);
		}
	};

	
	// Cast return type to your mixin's interface intersected with the superClass type
	return ValidationMixinClass as unknown as Constructor<ValidationMixinInterface> & T;
}

export default ValidationMixin;

