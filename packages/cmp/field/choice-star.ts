import {customElement} from 'lit/decorators.js';

import {LappFilledStar} from './choice/star/filled-star';

declare global {
  interface HTMLElementTagNameMap {
    'lapp-choice-star': LappChoiceStar;
  }
}

/**
 * @final
 * @suppress {visibility}
 */
@customElement('lapp-choice-star')
export  class LappChoiceStar extends LappFilledStar {
  
}
