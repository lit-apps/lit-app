import {customElement} from 'lit/decorators.js';

import {LappFilledSelect} from './select/filled-select';

declare global {
  interface HTMLElementTagNameMap {
    'lapp-select': LappSelect;
  }
}

/**
 * @final
 * @suppress {visibility}
 */
@customElement('lapp-select')
export  class LappSelect extends LappFilledSelect {
  
}
