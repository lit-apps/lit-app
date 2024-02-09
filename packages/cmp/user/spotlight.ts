import {customElement} from 'lit/decorators.js';

import { UserSpotlight } from './internal/spotlight';

declare global {
  interface HTMLElementTagNameMap {
    'lapp-user-spotlight': LappUserSpotlight;
  }
}

/**
 * An element to display user spotlight when provided with uid
 */
@customElement('lapp-user-spotlight')
export class LappUserSpotlight extends UserSpotlight {
 
}
