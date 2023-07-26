import {customElement} from 'lit/decorators.js';

import { UserName } from './internal/name.js';

declare global {
  interface HTMLElementTagNameMap {
    'lapp-user-name': LappUserName;
  }
}

/**
 * An element to display user name when provided with uid
 */
@customElement('lapp-user-name')
export  class LappUserName extends UserName {
 
}
