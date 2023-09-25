import {customElement} from 'lit/decorators.js';

import {LappFilledSelectInput} from './select/filled-select-input.js';

declare global {
  interface HTMLElementTagNameMap {
    'lapp-select-input': LappSelectInput;
  }
}

/**
 * @final
 * @suppress {visibility}
 */
@customElement('lapp-select-input')
export  class LappSelectInput extends LappFilledSelectInput {
  
}
