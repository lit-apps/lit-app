import {customElement} from 'lit/decorators.js';
import { MdOutlinedTextField } from '@material/web/textfield/outlined-text-field.js'
import {OutlinedOrder} from './lib/outlined-order';
import outlinedStyles from './outlinedStyles';
import orderStyles from './lib/orderStyles';

declare global {
  interface HTMLElementTagNameMap {
    'lapp-outlined-order': LappOutlinedOrder;
  }
}

/**
 * @final
 * @suppress {visibility}
 */
@customElement('lapp-outlined-order')
export class LappOutlinedOrder extends OutlinedOrder {
  static override styles = [
    ...MdOutlinedTextField.styles,
    ...orderStyles,
    outlinedStyles
  ];
}
