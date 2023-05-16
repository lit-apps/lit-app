import { LitElement, PropertyValues, html, nothing } from 'lit';
import { property, state } from 'lit/decorators.js'

declare global {
	interface HTMLElementEventMap {

	}
}

type Constructor<T = {}> = new (...args: any[]) => T;
export declare class supportingTextMixinInterface {
	// Define the interface for the mixin
	error: boolean
	errorText: string
	supportingText: string
	getAriaDescribedBy: () => string
}
/**
 * supportingTextMixin 
 * 
 * A Mixin that will add supporting text to a component
 * 
 * 
 */
export const supportingTextMixin = <T extends Constructor<LitElement>>(superClass: T) => {


	class supportingTextMixinClass extends superClass {

		/**
		 * Conveys additional information below the text field, such as how it should
		 * be used.
		 */
		@property() supportingText = '';
		/**
		 * Gets or sets whether or not the text field is in a visually invalid state.
		 *
		 * Calling `reportValidity()` will automatically update `error`.
		 */
		@property({ type: Boolean, reflect: true }) error = false;
		/**
		 * The error message that replaces supporting text when `error` is true. If
		 * `errorText` is an empty string, then the supporting text will continue to
		 * show.
		 *
		 * Calling `reportValidity()` will automatically update `errorText` to the
		 * native `validationMessage`.
		 */
		@property() errorText = '';

		/**
		 * When set to true, the error text's `role="alert"` will be removed, then
		 * re-added after an animation frame. This will re-announce an error message
		 * to screen readers.
		 */
		@state() private refreshErrorAlert = false;

		/**
		 * Whether or not a native error has been reported via `reportValidity()`.
		 */
		@state() private nativeError = false;
		/**
		 * The validation message displayed from a native error via
		 * `reportValidity()`.
		 */
		@state() private nativeErrorText = '';
		override render() {
			return [
				super.render(),
				this.renderSupportingText()
			]
		}

		private renderSupportingText() {
			const text = this.getSupportingText();
			if (!text) {
				return nothing;
			}

			return html`<span id="support"
				slot="supporting-text"
				role=${this.shouldErrorAnnounce() ? 'alert' : nothing}>${text}</span>`;
		}

		private get hasError() {
			return this.error || this.nativeError;
		}
		private shouldErrorAnnounce() {
			// Announce if there is an error and error text visible.
			// If refreshErrorAlert is true, do not announce. This will remove the
			// role="alert" attribute. Another render cycle will happen after an
			// animation frame to re-add the role.
			return this.hasError && !!this.getErrorText() && !this.refreshErrorAlert;
		}

		private getSupportingText() {
			const errorText = this.getErrorText();
			return this.hasError && errorText ? errorText : this.supportingText;
		}

		private getErrorText() {
			return this.error ? this.errorText : this.nativeErrorText;
		}

		getAriaDescribedBy() {
			if (this.getSupportingText()) {
				return 'support';
			}
			return
		}


	};
	// Cast return type to your mixin's interface intersected with the superClass type
	return supportingTextMixinClass as unknown as Constructor<supportingTextMixinInterface> & T;
}

export default supportingTextMixin;

