// import { css } from 'lit';
import {customElement} from 'lit/decorators.js';

import {SetRole} from './lib/set-role';

declare global {
  interface HTMLElementTagNameMap {
    'lapp-set-role': LappSetRole;
  }
}

/**
 * @final
 * @suppress {visibility}
 */
@customElement('lapp-access-set-role')
export default class LappSetRole extends SetRole {
	
  
}
