import {customElement} from 'lit/decorators.js';

import {LappFilledRadio} from './choice/radio/filled-radio';

declare global {
  interface HTMLElementTagNameMap {
    'lapp-choice-radio': LappChoiceRadio;
  }
}

/**
 * @final
 * @suppress {visibility}
 */
@customElement('lapp-choice-radio')
export  class LappChoiceRadio extends LappFilledRadio {
  
}
