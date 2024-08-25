import {customElement} from 'lit/decorators.js';

import {LappFilledSelect} from './select/filled-select';
import '@material/web/select/select-option.js'


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
