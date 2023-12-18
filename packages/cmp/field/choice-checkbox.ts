import {customElement} from 'lit/decorators.js';

import {LappFilledCheckbox} from './choice/checkbox/filled-checkbox';

declare global {
  interface HTMLElementTagNameMap {
    'lapp-choice-checkbox': LappChoiceCheckbox;
  }
}

/**
 * @final
 * @suppress {visibility}
 */
@customElement('lapp-choice-checkbox')
export  class LappChoiceCheckbox extends LappFilledCheckbox {
  
}
