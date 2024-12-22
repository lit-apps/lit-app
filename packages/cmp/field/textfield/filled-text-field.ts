import { customElement } from 'lit/decorators.js';
import { FilledTextField } from './internal/filled-text-field.js';
import filledStyles from './filledStyles';
import { MdFilledTextField } from '@material/web/textfield/filled-text-field.js'
import genericStyles from '../generic/styles';
declare global {
  interface HTMLElementTagNameMap {
    'lapp-filled-text-field': LappFilledTextField;
  }
}

/**
 * @final
 * @suppress {visibility}
 */
@customElement('lapp-filled-text-field')
export class LappFilledTextField extends FilledTextField {
  static override styles = [
    ...MdFilledTextField.styles,
    filledStyles,
    genericStyles
  ];
}
