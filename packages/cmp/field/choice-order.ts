import {customElement} from 'lit/decorators.js';

import {LappFilledOrder} from './choice/order/filled-order';

declare global {
  interface HTMLElementTagNameMap {
    'lapp-choice-order': LappChoiceOrder;
  }
}

/**
 * @final
 * @suppress {visibility}
 */
@customElement('lapp-choice-order')
export  class LappChoiceOrder extends LappFilledOrder {
  
}
