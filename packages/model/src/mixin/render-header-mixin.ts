import { MixinBase, MixinReturn } from '@lit-app/shared/types.js';
import { LitElement, TemplateResult, html, nothing } from 'lit';
import { property } from 'lit/decorators.js';
import { choose } from 'lit/directives/choose.js';
import { DefaultI, RenderConfig } from '../types/entity';

import('@material/web/icon/icon.js')


export declare class RenderHeaderMixinInterface {
	heading: string
	icon: string
	/**
	 * The level at which this entity should be rendered 
	 * 
	 * level 1 will display a h2 title with icon, 
	 * level 2 a h3 title without icon, 
	 * level 3 a h5 secondary title, 
	 * level 4 no title.
	 */
	level: number

	/**
	 * Name of the slot to render the header. 
	 * 
	 * By default it is '', so the header will be rendered directly in the element. 
	 * 
	 * If you want to render the header in a slot, you can override this method to return the name of the slot
	 * where the header should be rendered (for instance 'title').
	 */
	get slotHeaderName(): string
	/**
	 * Render the content of a header title.
	 * 
	 * Buy default it takes config.heading or this.heading as title.
	 * 
	 * @param data 
	 * @param config 
	 */
	renderTitle(data?: DefaultI, config?: RenderConfig): TemplateResult
	/**
	 * Same as renderTitle but for when data is an array.
	 * @param data 
	 * @param config 
	 */
	renderArrayTitle(data?: DefaultI, config?: RenderConfig): TemplateResult
	/**
	 * Render the header of the element. 
	 * 
	 * By default it will render a h2 title with icon. 
	 * 
	 * @param data 
	 * @param config 
	 */
	renderHeader(data?: DefaultI, config?: RenderConfig): TemplateResult
}


/**
 * RenderHeaderMixin - to be mixed to page elements that can displayed titles 
 * of different levels, depending on the context. 
 * 
 * Together with .header class and `focus-on-connected-mixin`, it allows to display focus
 * when an element is connected to the dom.
 * 
 * Level 1 will display a h2 title with icon, 
 * level 2 a h3 title without icon, 
 * level 3 a h5 secondary title, 
 * level 4 no title.
 */
export const RenderHeaderMixin = <T extends MixinBase<LitElement>>(
	superClass: T
): MixinReturn<T, RenderHeaderMixinInterface> => {

	abstract class RenderHeaderMixinClass extends superClass {

		@property() heading!: string;
		@property() icon!: string;
		@property({ type: Number }) level: number = 1;

		get slotHeaderName() { return ''; }

		renderTitle(_data?: DefaultI, config?: RenderConfig) {
			return html`${config?.heading || this.heading}`
		}

		renderArrayTitle(_data?: DefaultI, config?: RenderConfig) {
			return html`${config?.heading || this.heading}`
		}

		renderHeader(data?: DefaultI, config?: RenderConfig) {
			const title = this.renderTitle(data, config)
			return html`${choose(this.level,
				[
					[2, () => html`<h3 class="header layout horizontal">${title}</h3>`],
					[3, () => html`<h5 class="header secondary">${title}</h5>`],
					[4, () => html``]
				],
				() => html`
				<h2 class="header layout horizontal center wrap underline">
					<md-focus-ring  style="--md-focus-ring-shape: 10px"></md-focus-ring>
					<lapp-icon .icon=${config?.entityStatus.isEditing ? 'edit' : this.icon}></lapp-icon>
					${title}
				</h2>`
			)}`
		}

		override render() {
			return html`
				<slot name="header" slot=${this.slotHeaderName || nothing as unknown as string}>
					${this.renderHeader()}
				</slot>
				${super.render()}
			`;

		}

	};
	return RenderHeaderMixinClass;
}

export default RenderHeaderMixin;

