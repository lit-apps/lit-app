import { customElement } from 'lit/decorators.js';
import { FilledRecordField } from './internal/filled-record-field.js';
import filledStyles from './filledStyles';
import { MdFilledTextField } from '@material/web/textfield/filled-text-field.js'
import genericStyles from '../generic/styles';
import { CSSResult } from 'lit'; ``
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
  static styles: CSSResult[] = [
    ...MdFilledTextField.styles,
    filledStyles,
    genericStyles
  ];
}
