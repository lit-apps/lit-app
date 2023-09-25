import { html, css, LitElement, PropertyValues } from "lit";
import { customElement, property, state } from 'lit/decorators.js';
import ValidationMixin from '../generic/validationMixin';
// import {  Writeable } from '../types';

// const validity: Writeable<Partial<ValidityState>> = {
// 	customError: false,
// 	badInput: false,
// 	valueMissing: false,
// 	valid: true,
// };

/**
 * A proxy list to use with choice
 * It is responsible for the validation and the rendering of the list
 * We render in the light dom so 
 */

@customElement('ul-choice')
export default class ulChoice extends ValidationMixin(LitElement) {
	
	@state() override required!: boolean;
	@state() value!: string | string[];
	@state() customValidity: string = '';
	
	override createRenderRoot() {
		return this;
	}
}

declare global {
	interface HTMLElementTagNameMap {
		'ul-choice': ulChoice;
	}
}
