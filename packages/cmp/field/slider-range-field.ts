
import { customElement, property } from 'lit/decorators.js';

import { LappSliderField } from './slider-field';

declare global {
  interface HTMLElementTagNameMap {
    'lapp-slider-range-field': LappSliderRangeField;
  }
}

/**
 * # Slider 
 * 
 * @summary
 * slider is a component that display allow to register a slider and store it locally.
 
 * @final
 */
@customElement('lapp-slider-range-field')
export class LappSliderRangeField extends LappSliderField {
	@property({type: Boolean}) range = true;
}

