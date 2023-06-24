import {customElement} from 'lit/decorators.js';

import { UserSearch } from './lib/search.js';

declare global {
  interface HTMLElementTagNameMap {
    'lapp-user-search': LappUserSearch;
  }
}

/**
 * An element to display user select when provided with uid
 */
@customElement('lapp-user-search')
export  class LappUserSearch extends UserSearch {
 
}
