// TODO: import from lapp-textfield and remove lapp-textfield
import {customElement} from 'lit/decorators.js';

import { LappFilledTextField } from './textfield/filled-text-field.js';

declare global {
  interface HTMLElementTagNameMap {
    'lapp-text-field': LappTextfield;
  }
}

/**
 * @final
 * @suppress {visibility}
 */
@customElement('lapp-text-field')
export  class LappTextfield extends LappFilledTextField {
 
}
