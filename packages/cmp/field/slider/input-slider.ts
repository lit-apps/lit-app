
import { css } from 'lit';
import { customElement } from 'lit/decorators.js';

// import styles from './Slider-styles';
// import { CSSResult } from 'lit';
import { InputSlider } from './internal/input-slider';

declare global {
	interface HTMLElementTagNameMap {
		'lapp-slider': LappInputSlider;
	}
}

/**
 * # Slider 
 * 
 * @summary
 * Slider is a component that display allow to register a Slider and store it locally.
 
 * @final
 */
@customElement('lapp-slider')
export class LappInputSlider extends InputSlider {
	static override styles = [
		...InputSlider.styles, 
		css`
		label {
			display: flex;
    	align-items: center;
		}

		`

	];



}
