import { LitElement, PropertyValues } from 'lit';
import { property } from 'lit/decorators.js'
import { Field } from './field';

declare global {
	interface HTMLElementEventMap {

	}
}

export type Variant = 'a11y'

type Constructor<T = {}> = new (...args: any[]) => T;
export declare class A11yFieldMixinInterface {
	// Define the interface for the mixin
	variant: Variant | undefined;
}
/**
 * A11yFieldMixin Mixin
 * A mixin that renders field more accessible: 
 * - [ ] disable label animation
 * - [ ] allow label to wrap
 * - [ ] larger label
 */
export const A11yFieldMixin = <T extends Constructor<Field>>(superClass: T) => {


	class A11yFieldMixinClass extends superClass {

		/**
		 * a variant of the field. Variants are use to render field differently or augment them.
		 */
		@property({ reflect: true }) variant!: Variant;

	};
	// Cast return type to your mixin's interface intersected with the superClass type
	return A11yFieldMixinClass as unknown as Constructor<A11yFieldMixinInterface> & T;
}

export default A11yFieldMixin;

