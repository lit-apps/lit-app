import { customElement } from 'lit/decorators.js';
import { FilledRecordField } from './internal/filled-record-field.js';
import filledStyles from './filledStyles';
import { MdFilledTextField } from '@material/web/textfield/filled-text-field.js'
import genericStyles from '../generic/styles';
declare global {
  interface HTMLElementTagNameMap {
    'lapp-filled-record-field': LappFilledRecordField;
  }
}

/**
 * @final
 * @suppress {visibility}
 */
@customElement('lapp-filled-record-field')
export class LappFilledRecordField extends FilledRecordField {
  static override styles = [
    ...MdFilledTextField.styles,
    filledStyles,
    genericStyles
  ];
}
