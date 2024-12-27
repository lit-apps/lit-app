import { LitElement, PropertyValues, TemplateResult, html, nothing } from 'lit';
import { property } from 'lit/decorators.js'
import { choose } from 'lit/directives/choose.js';
import { ifDefined } from 'lit/directives/if-defined.js';
import { Choice } from './choice';
import { MediaIcon, MediaImage, MediaYoutube, Option } from './types';

declare global {
	interface HTMLElementEventMap {

	}
}

type Constructor<T = {}> = abstract new (...args: any[]) => T;
export declare class IllustrationMixinInterface {

	renderOptionIllustration: (option: Option) => TemplateResult
}
/**
 * IllustrationMixin a mixin that adds illustration to a choice option
 * 
 */
export const IllustrationMixin = <T extends Constructor<Choice>>(superClass: T) => {


	abstract class IllustrationMixinClass extends superClass {


		renderOptionIllustration(option: Option, slot: 'start' | 'end' = 'start') {
			const { media, alt } = option
			return html`${choose(media?.mediaType, [
				['image', () => {
					const m = media as MediaImage
					return html`
						<img data-variant="illustration" slot="${slot}" class="image" src="${m.url}" alt=${ifDefined(alt)} ></img>`
				}],
				['youtube', () => {
					const m = media as MediaYoutube
					const params = `controls=0&` + (m.params || '')
					return html`
						<lapp-youtube data-variant="illustration" slot="${slot}" class="video" videoid="${m.videoId}" playlabel=${ifDefined(m.playLabel)} params=${params}></lapp-youtube>`
				}],
				['icon', () => {
					const m = media as MediaIcon
					const icon = m?.icon || ''
					return html`<lapp-icon slot="${slot}" icon="${icon}"></lapp-icon>`
				}]
			],
				() => nothing as unknown as TemplateResult
			)}`

		}

	};
	// Cast return type to your mixin's interface intersected with the superClass type
	return IllustrationMixinClass as unknown as Constructor<IllustrationMixinInterface> & T;
}

export default IllustrationMixin;

