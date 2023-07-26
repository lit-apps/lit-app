
import { customElement } from 'lit/decorators.js';

import { OutlinedTextfieldSelect } from './internal/outlined-textfield-select.js';
import outlinedStyles from './outlinedStyles';
import { LappOutlinedSelect } from '../select/outlined-select.js'
import genericStyles from '../generic/styles';
import { CSSResult } from 'lit';

declare global {
  interface HTMLElementTagNameMap {
    'lapp-outlined-textfield-select': LappOutlinedTextfieldSelect;
  }
}

/**
 * @final
 * @suppress {visibility}
 */
@customElement('lapp-outlined-textfield-select')
export class LappOutlinedTextfieldSelect extends OutlinedTextfieldSelect {
  static override styles: CSSResult[] = [
    ...LappOutlinedSelect.styles, 
    outlinedStyles, 
    genericStyles
  ];
}
