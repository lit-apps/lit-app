import { Icon as I } from '@material/web/icon/internal/icon';
import { html } from 'lit';
import { query, property } from 'lit/decorators.js';

type OpticalSize = 20 | 24 | 40 | 48;
type Grade = -25 | 0 | 25
type Weight = 100 | 200 | 300 | 400 | 500 | 600 | 700

const svgCache = {};

function fetchSvgImage(name: string, fetchOptions: RequestInit): Promise<SVGElement> {
	const url = Icon.getURL(name);
	if (svgCache[url]) {
		// return cached SVG element
		return Promise.resolve(svgCache[url].cloneNode(true) as SVGElement);
	} else {
		// fetch SVG image from server
		return fetch(url, fetchOptions)
			.then(response => response.text())
			.then(str => new DOMParser().parseFromString(str, 'image/svg+xml'))
			.then(svg => {
				const svgEl = svg.querySelector('svg');
				if (svgEl) {
					if (!svgEl.getAttribute('viewBox') ) {
						svgEl.setAttribute('viewBox', `0 0 ${Icon.opticalSize} ${Icon.opticalSize}`)
					}
					svgEl.setAttribute('fill', 'currentColor');
					// cache SVG element
					svgCache[url] = svgEl.cloneNode(true) as SVGElement;
					return svgEl;
				} else {
					throw new Error('SVG element not found in fetched document');
				}
			});
	}
}

/**
 * A component to display icons
 * It overrides MDC's Icon component to provide lazy loading of icons
 */
export class Icon extends I {

	static getURL(name: string) {
		return `https://fonts.gstatic.com/s/i/short-term/release/materialsymbolsoutlined/${name}/${this.fill ? 'fill1' : 'default'}/${this.opticalSize}px.svg`
	}

	static fill: boolean = true
	static opticalSize: OpticalSize = 40
	static grade: Grade = 0
	static weight: Weight = 400
	static fetchOptions: RequestInit = { cache: 'default' }

	@query('slot') slotEl: HTMLSlotElement;
	@property({ attribute: 'aria-label' }) ariaLabel!: string;

	override render() {
		return html`<slot @slotchange=${this.onSlotChange}></slot>`;
	}

	private onSlotChange() {
		const nodes = this.slotEl?.assignedNodes();
		const name = nodes?.[0];

		// prevent codepoints from being rendered via SVG - only works with named icons
		if (name && name instanceof Text && name.textContent && !name.textContent?.startsWith('&#')) {

			fetchSvgImage(name.textContent, Icon.fetchOptions)
				.then(svgEl => {

					svgEl.setAttribute('aria-label', this.ariaLabel ?? name.textContent);
					// replace existing svg element
					const existing = this.renderRoot.querySelector('svg');
					if (existing) {
						this.renderRoot.removeChild(existing);
					}
					this.renderRoot.appendChild(svgEl)
				})
		}
	}
}