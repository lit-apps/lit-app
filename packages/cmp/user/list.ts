import {customElement} from 'lit/decorators.js';

import { UserList } from './internal/list.js';

declare global {
  interface HTMLElementTagNameMap {
    'lapp-user-list': LappUserList;
  }
}

/**
 * An element to display user list when provided with uid
 */
@customElement('lapp-user-list')
export  class LappUserList extends UserList {
 
}
