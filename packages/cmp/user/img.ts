import {customElement} from 'lit/decorators.js';

import { UserImg } from './lib/img.js';

declare global {
  interface HTMLElementTagNameMap {
    'lapp-user-name': LappUserImg;
  }
}

/**
 * An element to display user image when provided with uid
 */
@customElement('lapp-user-img')
export  class LappUserImg extends UserImg {
 
}
