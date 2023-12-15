import { html, css, LitElement, PropertyValues } from "lit";
import { customElement, property, state } from 'lit/decorators.js';

/**
 * A proxy list to use with choice
 * It is responsible for the validation and the rendering of the list
 * We render in the light dom so 
 */

@customElement('ul-choice')
export default class ulChoice extends LitElement {
	
	override createRenderRoot() {
		return this;
	}
}

declare global {
	interface HTMLElementTagNameMap {
		'ul-choice': ulChoice;
	}
}
