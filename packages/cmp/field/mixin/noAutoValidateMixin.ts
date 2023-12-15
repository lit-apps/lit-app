import { LitElement, PropertyValues } from 'lit';
import { property } from 'lit/decorators.js'

type Constructor<T = {}> = new (...args: any[]) => T;
export declare class NoAutoValidateMixinInterface {
	/**
		* Prevent automatic check validity on blur
		*/
	noAutoValidate: string
}
/**
 * NoAutoValidateMixin - a mixin that report vailidity on blur, 
 * except when `noAutoValidate` is set to true
 */
export const NoAutoValidateMixin = <T extends Constructor<LitElement & 
{
	reportValidity: () => void
	field: any
}>>(superClass: T) => {


	class NoAutoValidateMixinClass extends superClass {


		/**
		 * Prevent automatic check validity on blur
		 */
		@property({ type: Boolean }) noAutoValidate: boolean = false;

		override willUpdate(changedProperties: PropertyValues) {
			if (changedProperties.has('noAutoValidate')) {
				if (!this.noAutoValidate) {
					this.addEventListener('blur', this.reportValidity)
				} else {
					this.removeEventListener('blur', this.reportValidity)
				}
			}
			super.willUpdate(changedProperties);
		}

	};
	// Cast return type to your mixin's interface intersected with the superClass type
	return NoAutoValidateMixinClass as unknown as Constructor<NoAutoValidateMixinInterface> & T;
}

export default NoAutoValidateMixin;

