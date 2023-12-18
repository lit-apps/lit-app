import { customElement } from 'lit/decorators.js';
import { FilledOrder } from './internal/filled-order';
import { MdFilledTextField } from '@material/web/textfield/filled-text-field.js'
import filledStyles from './filledStyles';
import orderStyles from './internal/orderStyles';
import { CSSResult } from 'lit';

declare global {
  interface HTMLElementTagNameMap {
    'lapp-filled-order': LappFilledOrder;
  }
}

/**
 * @final
 * @suppress {visibility}
 */
@customElement('lapp-filled-order')
export class LappFilledOrder extends FilledOrder {
  static override styles: CSSResult[] = [
    ...MdFilledTextField.styles,
    ...orderStyles, 
    filledStyles,
  ];
}
