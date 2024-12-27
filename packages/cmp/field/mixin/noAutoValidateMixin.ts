import { MixinBase, MixinReturn } from '@lit-app/shared/types.js';
import { LitElement, PropertyValues } from 'lit';
import { property } from 'lit/decorators.js'

type F = {
	reportValidity: () => void
}
type BaseT = LitElement & F
export declare class NoAutoValidateMixinInterface {
	/**
		* Prevent automatic check validity on blur
		*/
	noAutoValidate: boolean
}
/**
 * NoAutoValidateMixin - a mixin that report validity on blur, 
 * except when `noAutoValidate` is set to true
 */
export const NoAutoValidateMixin = <T extends MixinBase<BaseT>>(
	superClass: T
): MixinReturn<T, NoAutoValidateMixinInterface> => {

	abstract class NoAutoValidateMixinClass extends superClass {

		/**
		 * Prevent automatic check validity on blur
		 */
		@property({ type: Boolean }) noAutoValidate: boolean = false;

		override willUpdate(changedProperties: PropertyValues<this>) {
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
	return NoAutoValidateMixinClass;
}

export default NoAutoValidateMixin;

