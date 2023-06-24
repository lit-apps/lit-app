import {customElement} from 'lit/decorators.js';

import { DomObserver } from './lib/observer.js';

declare global {
  interface HTMLElementTagNameMap {
    'lapp-dom-observer': LappDomObserver;
  }
}

/**
 * Listen to dom changes and dispatch content-changed event when content changes 
 * @fires content-changed
 */
@customElement('lapp-dom-observer')
export  class LappDomObserver extends DomObserver {
 
}
