
import { customElement } from 'lit/decorators.js';

import { OutlinedRecordField } from './internal/outlined-record-field.js';
import outlinedStyles from './outlinedStyles';
import { MdOutlinedTextField } from '@material/web/textfield/outlined-text-field.js'
import genericStyles from '../generic/styles';
import { CSSResult } from 'lit';

declare global {
  interface HTMLElementTagNameMap {
    'lapp-outlined-record-field': LappOutlinedRecordField;
  }
}

/**
 * @final
 * @suppress {visibility}
 */
@customElement('lapp-outlined-record-field')
export class LappOutlinedRecordField extends OutlinedRecordField {
  static styles: CSSResult[] = [
    ...MdOutlinedTextField.styles, 
    outlinedStyles, 
    genericStyles
  ];
}
