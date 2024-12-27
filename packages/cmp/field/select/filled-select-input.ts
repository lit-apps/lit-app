import { customElement } from 'lit/decorators.js';
import { FilledSelectInput } from './internal/filled-select-input.js';
import filledStyles from './filledStyles';
import { MdFilledSelect } from '@material/web/select/filled-select.js'
import genericStyles from '../generic/styles';
import SelectInputStyles from './internal/selectInputStyles.js';
declare global {
  interface HTMLElementTagNameMap {
    'lapp-filled-select-input': LappFilledSelectInput;
  }
}

/**
 * @final
 * @suppress {visibility}
 */
@customElement('lapp-filled-select-input')
export class LappFilledSelectInput extends FilledSelectInput {
  static override styles = [
    ...MdFilledSelect.styles,
    filledStyles,
    genericStyles, 
    SelectInputStyles
  ];
}
