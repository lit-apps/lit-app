import { customElement } from 'lit/decorators.js';
import { FilledTextfieldSelect } from './internal/filled-textfield-select.js';
import filledStyles from './filledStyles';
import { LappFilledSelect } from '../select/filled-select.js'
import genericStyles from '../generic/styles';
import { CSSResult } from 'lit'; ``
declare global {
  interface HTMLElementTagNameMap {
    'lapp-filled-textfield-select': LappFilledTextfieldSelect;
  }
}

/**
 * @final
 * @suppress {visibility}
 */
@customElement('lapp-filled-textfield-select')
export class LappFilledTextfieldSelect extends FilledTextfieldSelect {
  static override styles: CSSResult[] = [
    ...LappFilledSelect.styles,
    filledStyles,
    genericStyles
  ];
}
