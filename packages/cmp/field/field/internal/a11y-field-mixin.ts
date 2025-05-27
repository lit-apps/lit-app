import { PropertyValues, TemplateResult, html, nothing } from 'lit';
import { property, query } from 'lit/decorators.js';
import { classMap } from 'lit/directives/class-map.js';

import { parseInline } from '@lit-app/shared/md/index.js';
import { Field } from '@material/web/field/internal/field';

export type Variant = 'a11y'

type Constructor<T = {}> = new (...args: any[]) => T;
export declare class A11yFieldMixinInterface {
	/**
	 * a variant of the field. Variants are use to render field differently or augment them.
	 */
	variant: Variant | undefined;
	/**
	 * whether to alway show the label above the field and disable animation
	 */
	labelAbove: boolean | undefined;

	/**
	 * whether to persist supporting text 
	 * @default false
	 */
	persistSupportingText: boolean | undefined;
	/**
	 * get the label as text - and parsed when it is markdown
	 */
	getTextLabel(): string;

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

	// @ts-expect-error - renderLabel is private in Field
	class A11yFieldMixinClass extends superClass {

		@property({ reflect: true }) variant!: Variant;
		@property({ reflect: true, type: Boolean }) persistSupportingText: boolean = false;
		@property({ type: Boolean, reflect: true }) labelAbove = false;
		@query('.label[aria-hidden="false"]') labelEl!: HTMLElement;

		getTextLabel() {
			return this.labelEl?.innerText || '';
		}

		/** we store markdown template for label */
		private _md: TemplateResult | typeof nothing = nothing;

		protected override willUpdate(props: PropertyValues) {
			if (props.has('variant') && this.variant === 'a11y') {
				this.labelAbove = true;
				this.populated = true;
			}
			// set markdown label as populated
			if ((props.has('label') || props.has('variant')) && this.variant === 'a11y') {
				this._md = this.label ? parseInline(this.label) : nothing;
			}

			// always stay populated
			// this is useful with select field for example
			if (props.has('populated') && this.variant === 'a11y' && !this.populated) {
				this.populated = true;
			}
			super.willUpdate(props);
		}

		protected override renderLabel(isFloating: boolean) {
			if (this.variant !== 'a11y') {
				// @ts-expect-error = renderLabel is private in Field
				return super.renderLabel(isFloating);
			}

			if (!this.label) {
				return nothing;
			}

			let visible: boolean;
			if (isFloating) {

				// Floating label is visible when focused/populated or when animating.
				// @ts-expect-error - isAnimating is private in Field
				visible = this.focused || this.populated || this.isAnimating;
			} else {
				// Resting label is visible when unfocused. It is never visible while
				// animating.
				// @ts-expect-error - isAnimating is private in Field
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
	return A11yFieldMixinClass as unknown as Constructor<A11yFieldMixinInterface> & T;
}

export default A11yFieldMixin;

