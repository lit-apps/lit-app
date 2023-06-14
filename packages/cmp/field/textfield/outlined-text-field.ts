import { customElement } from 'lit/decorators.js';
import { OutlinedTextField } from './lib/outlined-text-field.js';
import outlinedStyles from './outlinedStyles';
import { MdOutlinedTextField } from '@material/web/textfield/outlined-text-field.js'
import genericStyles from '../generic/styles';
import { CSSResult } from 'lit'; ``
declare global {
  interface HTMLElementTagNameMap {
    'lapp-outlined-text-field': LappOutlinedTextField;
  }
}

/**
 * @final
 * @suppress {visibility}
 */
@customElement('lapp-outlined-text-field')
export class LappOutlinedTextField extends OutlinedTextField {
  static override styles: CSSResult[] = [
    ...MdOutlinedTextField.styles,
    outlinedStyles,
    genericStyles
  ];
}
