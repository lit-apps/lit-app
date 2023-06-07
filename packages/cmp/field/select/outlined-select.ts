
import { customElement } from 'lit/decorators.js';

import { OutlinedSelect } from './lib/outlined-select.js';
import outlinedStyles from './outlinedStyles';
import { MdOutlinedSelect } from '@material/web/select/outlined-select.js'
import genericStyles from '../generic/styles';
import { CSSResult } from 'lit';

declare global {
  interface HTMLElementTagNameMap {
    'lapp-outlined-select': LappOutlinedSelect;
  }
}

/**
 * @final
 * @suppress {visibility}
 */
@customElement('lapp-outlined-select')
export class LappOutlinedSelect extends OutlinedSelect {
  static override styles: CSSResult[] = [
    ...MdOutlinedSelect.styles, 
    outlinedStyles, 
    genericStyles
  ];
}
