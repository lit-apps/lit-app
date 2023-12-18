
import { customElement } from 'lit/decorators.js';

import { LappFilledSlider } from './slider/filled-slider';

declare global {
  interface HTMLElementTagNameMap {
    'lapp-slider-field': LappSliderField;
  }
}

/**
 * # Slider 
 * 
 * @summary
 * slider is a component that display allow to register a slider and store it locally.
 
 * @final
 */
@customElement('lapp-slider-field')
export class LappSliderField extends LappFilledSlider {
 
}

