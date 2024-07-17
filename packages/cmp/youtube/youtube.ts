import 'lite-youtube-embed';

import { customElement } from 'lit/decorators.js';


type Constructor<T = {}> = new (...args: any[]) => T;

/**
 * Interface for the lite-youtube-embed class v0.3.2
 */
interface YTClass extends Constructor<HTMLElement & {
	getParams(): URLSearchParams
	connectedCallback(): void
	needsYTApi: boolean
}> {}

// get class from 'lite-youtube' customElements
const LiteYoutubeClass: YTClass = customElements.get('lite-youtube') as YTClass;

/**
 * A youtube embed component, based on lite-youtube-embed, 
 * with default parameters. 
 * 
 * It adds enablejsapi=1 and rel=0 to the default parameters.
 * 
 * We used to recommend the use of `modesbranding=1` but this is no longer
 * supported. 
 * 
 */

@customElement('lapp-youtube')
export default class lappYoutube  extends LiteYoutubeClass {
	override connectedCallback() {
		super.connectedCallback();
		// We need to load the youtube API to autoplay and stop autoplay on blur or page change
		this.needsYTApi = true;
	}
	override getParams() {
		const params = super.getParams();
		params.append('enablejsapi', '1');
		params.append('rel', '1');
		return params;
}
// 	async addIframe(){
// 		if (this.classList.contains('lyt-activated')) return;
// 		this.classList.add('lyt-activated');

// 		const params = new URLSearchParams(this.getAttribute('params') || []);
// 		params.append('autoplay', '1');
// 		params.append('playsinline', '1');
// 		params.append('enablejsapi', '1');
// 		params.append('rel', '0');

// 		if (this.needsYTApiForAutoplay) {
// 			return this.addYTPlayerIframe(params);
// 		}

// 		const iframeEl = document.createElement('iframe');
// 		iframeEl.width = 560;
// 		iframeEl.height = 315;
// 		// No encoding necessary as [title] is safe. https://cheatsheetseries.owasp.org/cheatsheets/Cross_Site_Scripting_Prevention_Cheat_Sheet.html#:~:text=Safe%20HTML%20Attributes%20include
// 		iframeEl.title = this.playLabel;
// 		iframeEl.allow = 'accelerometer; autoplay; encrypted-media; gyroscope; picture-in-picture';
// 		iframeEl.allowFullscreen = true;
// 		// AFAIK, the encoding here isn't necessary for XSS, but we'll do it only because this is a URL
// 		// https://stackoverflow.com/q/64959723/89484
// 		iframeEl.src = `https://www.youtube-nocookie.com/embed/${encodeURIComponent(this.videoId)}?${params.toString()}`;
// 		this.append(iframeEl);

// 		// Set focus for a11y
// 		iframeEl.focus();
// }
	
}

declare global {
	interface HTMLElementTagNameMap {
		'lapp-youtube': lappYoutube;
	}
}
