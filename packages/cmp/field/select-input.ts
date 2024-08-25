import {customElement} from 'lit/decorators.js';

import {LappFilledSelectInput} from './select/filled-select-input.js';
import '@material/web/select/select-option.js'

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
