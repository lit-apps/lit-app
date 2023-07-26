import { customElement } from 'lit/decorators.js';
import { FilledStar } from './internal/filled-star.js';
import filledStyles from './filledStyles';
import { MdFilledTextField } from '@material/web/textfield/filled-text-field.js'
import starStyles from './internal/starStyles';
import { CSSResult } from 'lit'; ``
declare global {
  interface HTMLElementTagNameMap {
    'lapp-filled-star': LappFilledStar;
  }
}

/**
 * @final
 * @suppress {visibility}
 */
@customElement('lapp-filled-star')
export class LappFilledStar extends FilledStar {
  static override styles: CSSResult[] = [
    ...MdFilledTextField.styles,
    ...starStyles,
    filledStyles
    ];
}
