import { nothing, LitElement, PropertyValueMap, PropertyValues, TemplateResult, css, html } from 'lit';
import { property } from 'lit/decorators.js'
import {classMap} from 'lit/directives/class-map.js';

import { Field } from '@material/web/field/internal/field';
import {parseInline} from '@lit-app/md-parser';

export type Variant = 'a11y'

type Constructor<T = {}> = new (...args: any[]) => T;
type RenderLabel = (isFloating: boolean) => TemplateResult | typeof nothing;
export declare class A11yFieldMixinInterface {
	// Define the interface for the mixin
	variant: Variant | undefined;
	labelAbove: boolean | undefined;
	renderLabel: RenderLabel;

}
/**
 * A11yFieldMixin Mixin
 * A mixin that renders field more accessible: 
 * - [x] disable label animation
 * - [x] allow label to wrap
 * - [x] larger label
 * - [ ] render markdown in label
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

		/** we store markdown template for label */
		private _md: TemplateResult | typeof nothing = nothing;

		protected override willUpdate(props: PropertyValues) {
			if (props.has('variant') && this.variant === 'a11y') {
				this.labelAbove = true;
				this.populated = true;
			}
			// set markdown label as populated
			if((props.has('label') || props.has('variant')) && this.variant === 'a11y') {
				this._md = this.label ? parseInline(this.label) : nothing;
			}

			// always stay populated
			// this is useful with select field for example
			if (props.has('populated') && this.variant === 'a11y' && !this.populated) {
				this.populated = true;
			}
			super.willUpdate(props);
		}

		private override renderLabel(isFloating: boolean) {
			if (this.variant !== 'a11y') {
				return super.renderLabel(isFloating);
			}

			if (!this.label) {
				return nothing;
			}
	
			let visible: boolean;
			if (isFloating) {
				// Floating label is visible when focused/populated or when animating.
				visible = this.focused || this.populated || this.isAnimating;
			} else {
				// Resting label is visible when unfocused. It is never visible while
				// animating.
				visible = !this.focused && !this.populated && !this.isAnimating;
			}
	
			const classes = {
				'hidden': !visible,
				'floating': isFloating,
				'resting': !isFloating,
			};
	
			// Add '*' if a label is present and the field is required
			// the difference is that we render a template and not a string
			const labelHTML = html`${this._md}${this.required ? '*' : ''}`;
	
			return html`
				<span class="label ${classMap(classes)}"
					aria-hidden=${!visible}
				>${labelHTML}</span>
			`;
		}


	};
	// Cast return type to your mixin's interface intersected with the superClass type
	return A11yFieldMixinClass as unknown as Constructor<A11yFieldMixinInterface> & T;
}

export default A11yFieldMixin;

