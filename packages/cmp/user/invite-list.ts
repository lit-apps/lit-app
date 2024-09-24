import {customElement} from 'lit/decorators.js';

import { InviteList } from './internal/invite-list.js';

declare global {
  interface HTMLElementTagNameMap {
    'lapp-invite-list': LappInviteList;
  }
}

/**
 * An element to display user list when provided with uid
 */
@customElement('lapp-invite-list')
export  class LappInviteList extends InviteList {
 
}
