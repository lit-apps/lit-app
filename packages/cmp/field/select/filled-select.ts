import { customElement } from 'lit/decorators.js';
import { FilledSelect } from './lib/filled-select.js';
import filledStyles from './filledStyles';
import { MdFilledSelect } from '@material/web/select/filled-select.js'
import genericStyles from '../generic/styles';
import { CSSResult } from 'lit'; ``
declare global {
  interface HTMLElementTagNameMap {
    'lapp-filled-select': LappFilledSelect;
  }
}

/**
 * @final
 * @suppress {visibility}
 */
@customElement('lapp-filled-select')
export class LappFilledSelect extends FilledSelect {
  static override styles: CSSResult[] = [
    ...MdFilledSelect.styles,
    filledStyles,
    genericStyles
  ];
}
