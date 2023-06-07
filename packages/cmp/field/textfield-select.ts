import {customElement} from 'lit/decorators.js';

import {LappFilledTextfieldSelect} from './textfield-select/filled-textfield-select';

declare global {
  interface HTMLElementTagNameMap {
    'lapp-text-field-select': LappSelect;
  }
}

/**
 * @final
 * @suppress {visibility}
 */
@customElement('lapp-text-field-select')
export  class LappSelect extends LappFilledTextfieldSelect {
  
}
