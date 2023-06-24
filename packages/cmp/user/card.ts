import {customElement} from 'lit/decorators.js';

import { UserCard } from './lib/card.js';

declare global {
  interface HTMLElementTagNameMap {
    'lapp-user-card': LappUserCard;
  }
}

/**
 * An element to display user card when provided with uid
 */
@customElement('lapp-user-card')
export  class LappUserCard extends UserCard {
 
}
