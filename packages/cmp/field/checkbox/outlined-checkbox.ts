
import { customElement } from 'lit/decorators.js';

import { OutlinedCheckbox } from './internal/outlined-checkbox.js';
import outlinedStyles from './outlinedStyles';
import { MdOutlinedTextField } from '@material/web/textfield/outlined-text-field.js'
import genericStyles from '../generic/styles';
import sharedStyles from './sharedStyles';

declare global {
  interface HTMLElementTagNameMap {
    'lapp-outlined-checkbox-field': LappOutlinedCheckbox;
  }
}

/**
 * @final
 * @suppress {visibility}
 */
@customElement('lapp-outlined-checkbox-field')
export class LappOutlinedCheckbox extends OutlinedCheckbox {
  static override styles = [
    ...MdOutlinedTextField.styles, 
    outlinedStyles, 
    genericStyles,
    sharedStyles
  ];
}
