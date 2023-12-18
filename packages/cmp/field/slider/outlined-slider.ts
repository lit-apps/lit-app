
import { customElement } from 'lit/decorators.js';

import { OutlinedSlider } from './internal/outlined-slider.js';
import outlinedStyles from './outlinedStyles';
import { MdOutlinedTextField } from '@material/web/textfield/outlined-text-field.js'
import genericStyles from '../generic/styles';
import sharedStyles from './sharedStyles';
import { CSSResult } from 'lit';

declare global {
  interface HTMLElementTagNameMap {
    'lapp-outlined-slider-field': LappOutlinedSlider;
  }
}

/**
 * @final
 * @suppress {visibility}
 */
@customElement('lapp-outlined-slider-field')
export class LappOutlinedSlider extends OutlinedSlider {
  static styles: CSSResult[] = [
    ...MdOutlinedTextField.styles, 
    outlinedStyles, 
    genericStyles,
    sharedStyles
  ];
}
