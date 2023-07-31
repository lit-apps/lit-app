// import { css } from 'lit';
import {customElement} from 'lit/decorators.js';

import {AddRole} from './internal/add-role';

declare global {
  interface HTMLElementTagNameMap {
    'lapp-add-role': LappAddRole;
  }
}

/**
 * @final
 * @suppress {visibility}
 */
@customElement('lapp-access-add-role')
export default class LappAddRole extends AddRole {
	
  
}
