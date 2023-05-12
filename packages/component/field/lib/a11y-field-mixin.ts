import { LitElement, PropertyValueMap, PropertyValues, TemplateResult, html } from 'lit';
import { property } from 'lit/decorators.js'
import { Field } from './field';

export type Variant = 'a11y'

type Constructor<T = {}> = new (...args: any[]) => T;
type RenderLabel = (isFloating: boolean) => TemplateResult;
export declare class A11yFieldMixinInterface {
	// Define the interface for the mixin
	variant: Variant | undefined;
	labelAbove: boolean | undefined;
	renderA11yLabel: RenderLabel;

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

		/**
		 * whether to alway show the label above the field and disable animation
		 */
		@property({ type: Boolean, reflect: true }) labelAbove = false;

		// constructor(...args: any[]) {
		// 	super(...args);
		// 	// trick to bypass override private method TS error
		// }

		protected override willUpdate(props: PropertyValues) {
			if (props.has('variant') && this.variant === 'a11y') {
				this.labelAbove = true;
				this.populated = true;
			}
			super.willUpdate(props);
		}

		private override renderLabel(isFloating: boolean) {
			if (this.labelAbove || this.variant === 'a11y') {
				let labelText = this.label ?? '';
				// Add '*' if a label is present and the field is required
				labelText += this.required && labelText ? '*' : '';

				return html`
					<div class="label label-above"
      			>${labelText}</div>
				`;
			}
			// @ts-ignore
			return super.renderLabel(isFloating);

		}

	};
	// Cast return type to your mixin's interface intersected with the superClass type
	return A11yFieldMixinClass as unknown as Constructor<A11yFieldMixinInterface> & T;
}

export default A11yFieldMixin;

