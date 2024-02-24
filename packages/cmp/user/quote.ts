import {customElement} from 'lit/decorators.js';

import { UserQuote } from './internal/quote.js';

declare global {
  interface HTMLElementTagNameMap {
    'lapp-user-quote': LappUserQuote;
  }
}

/**
 * An element to display user image when provided with uid
 */
@customElement('lapp-user-quote')
export  class LappUserQuote extends UserQuote {
 
}
