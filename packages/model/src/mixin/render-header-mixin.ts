import { LitElement, html, TemplateResult } from 'lit';
import { property } from 'lit/decorators.js'
import { choose } from 'lit/directives/choose.js';
import { DefaultI, RenderConfig } from '../types/entity';
import('@material/web/icon/icon.js')


type Constructor<T = {}> = new (...args: any[]) => T;
export declare class RenderHeaderMixinInterface {
	heading: string
	icon: string
	level: number
	renderTitle(data?: DefaultI, config?: RenderConfig): TemplateResult
	renderHeader(data?: DefaultI, config?: RenderConfig): TemplateResult
}


/**
 * RenderHeaderMixin - to be mixed to page elements that can displayed titles 
 * of different levels, depending on the context. 
 * 
 * Level 1 will display a h2 title with icon, 
 * level 2 a h3 title without icon, 
 * level 3 a h5 secondary title, 
 * level 4 no title.
 */
export const RenderHeaderMixin = <T extends Constructor<LitElement>>(superClass: T) => {

	class RenderHeaderMixinClass extends superClass {

		@property() heading!: string;
		@property() icon!: string;
		@property({ type: Number }) level: number = 1;


		renderTitle(_data?: DefaultI, _config?: RenderConfig): TemplateResult {
			return html`${this.heading}`
		}
	
		renderHeader(data?: DefaultI, config?: RenderConfig): TemplateResult {
			const title = this.renderTitle(data, config)
			return html`${choose(this.level,
				[
					[2, () => html`<h3 class="layout horizontal">${title}</h3>`],
					[3, () => html`<h5 class="secondary">${title}</h5>`],
					[4, () => html``]
				],
				() => html`
				<h2 class="layout horizontal underline">
					<md-icon>${config?.entityStatus.isEditing ? 'edit' : this.icon}</md-icon>
					${title}
				</h2>`
			)}`
	
		}
	
	};
	// Cast return type to your mixin's interface intersected with the superClass type
	return RenderHeaderMixinClass as unknown as Constructor<RenderHeaderMixinInterface> & T;
}

export default RenderHeaderMixin;

