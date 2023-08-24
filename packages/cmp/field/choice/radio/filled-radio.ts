import { customElement } from 'lit/decorators.js';
import { FilledRadio } from './internal/filled-radio.js';
import filledStyles from './filledStyles';
import { MdFilledTextField } from '@material/web/textfield/filled-text-field.js'
import genericStyles from '../../generic/styles';
import choiceStyles from '../styles';
import sharedStyles from './internal/shared-styles';
import { CSSResult } from 'lit'; ``
declare global {
  interface HTMLElementTagNameMap {
    'lapp-filled-radio': LappFilledRadio;
  }
}

/**
 * @final
 * @suppress {visibility}
 */
@customElement('lapp-filled-radio')
export class LappFilledRadio extends FilledRadio {
  static styles: CSSResult[] = [
    ...MdFilledTextField.styles,
    sharedStyles,
    filledStyles,
    genericStyles, 
    choiceStyles
  ];
}
