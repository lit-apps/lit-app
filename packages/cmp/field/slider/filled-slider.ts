import { customElement } from 'lit/decorators.js';
import { FilledSlider } from './internal/filled-slider.js';
import filledStyles from './filledStyles';
import sharedStyles from './sharedStyles';
import { MdFilledTextField } from '@material/web/textfield/filled-text-field.js'
import genericStyles from '../generic/styles';
import { CSSResult } from 'lit'; ``
declare global {
  interface HTMLElementTagNameMap {
    'lapp-filled-slider-field': LappFilledSlider;
  }
}

/**
 * @final
 * @suppress {visibility}
 */
@customElement('lapp-filled-slider-field')
export class LappFilledSlider extends FilledSlider {
  static styles: CSSResult[] = [
    ...MdFilledTextField.styles,
    filledStyles,
    genericStyles, 
    sharedStyles
  ];
}
