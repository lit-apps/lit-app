import {customElement} from 'lit/decorators.js';

import { UserSelectItem } from './internal/select-item.js';

declare global {
  interface HTMLElementTagNameMap {
    'lapp-user-select-item': LappUserSelectItem;
  }
}

/**
 * An element to display user card when provided with uid
 */
@customElement('lapp-user-select-item')
export  class LappUserSelectItem extends UserSelectItem {
 
}
