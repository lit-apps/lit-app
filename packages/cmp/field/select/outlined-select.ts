
import { customElement } from 'lit/decorators.js';

import { OutlinedSelect } from './internal/outlined-select.js';
import outlinedStyles from './outlinedStyles';
import { MdOutlinedSelect } from '@material/web/select/outlined-select.js'
import genericStyles from '../generic/styles';

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
  static override styles = [
    ...MdOutlinedSelect.styles, 
    outlinedStyles, 
    genericStyles
  ];
}
