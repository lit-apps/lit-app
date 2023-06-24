// import { css } from 'lit';
import {customElement} from 'lit/decorators.js';
// import { form, styleTypography, accessibility, page } from '@preignition/preignition-styles';

import {AddRole} from './lib/add-role';

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
