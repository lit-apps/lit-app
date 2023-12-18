import { customElement } from 'lit/decorators.js';
import { OutlinedSelectInput } from './internal/outlined-select-input.js';
import outlinedStyles from './outlinedStyles';
import { MdOutlinedSelect } from '@material/web/select/outlined-select.js'
import genericStyles from '../generic/styles';
import SelectInputStyles from './internal/selectInputStyles.js';
import { CSSResult } from 'lit'; 
declare global {
  interface HTMLElementTagNameMap {
    'lapp-outlined-select-input': LappOutlinedSelectInput;
  }
}

/**
 * @final
 * @suppress {visibility}
 */
@customElement('lapp-outlined-select-input')
export class LappOutlinedSelectInput extends OutlinedSelectInput {
  static override styles: CSSResult[] = [
    ...MdOutlinedSelect.styles,
    outlinedStyles,
    genericStyles, 
    SelectInputStyles
  ];
}
