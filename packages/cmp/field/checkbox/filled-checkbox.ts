import { customElement } from 'lit/decorators.js';
import { FilledCheckbox } from './internal/filled-checkbox.js';
import filledStyles from './filledStyles';
import sharedStyles from './sharedStyles';
import { MdFilledTextField } from '@material/web/textfield/filled-text-field.js'
import genericStyles from '../generic/styles';
declare global {
  interface HTMLElementTagNameMap {
    'lapp-filled-checkbox-field': LappFilledCheckbox;
  }
}

/**
 * @final
 * @suppress {visibility}
 */
@customElement('lapp-filled-checkbox-field')
export class LappFilledCheckbox extends FilledCheckbox {
  static override styles = [
    ...MdFilledTextField.styles,
    filledStyles,
    genericStyles, 
    sharedStyles
  ];
}
