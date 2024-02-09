import {customElement} from 'lit/decorators.js';

import { UserThread } from './internal/thread';

declare global {
  interface HTMLElementTagNameMap {
    'lapp-user-thread': LappUserThread;
  }
}

/**
 * A card like container with an avatar on the left
 */
@customElement('lapp-user-thread')
export class LappUserThread extends UserThread {
 
}
