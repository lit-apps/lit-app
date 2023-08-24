
import { customElement } from 'lit/decorators.js';

import { OutlinedRadio } from './internal/outlined-radio.js';
import outlinedStyles from './outlinedStyles';
import { MdOutlinedTextField } from '@material/web/textfield/outlined-text-field.js'
import genericStyles from '../../generic/styles';
import choiceStyles from '../styles';
import sharedStyles from './internal/shared-styles';
import { CSSResult } from 'lit';

declare global {
  interface HTMLElementTagNameMap {
    'lapp-outlined-radio': LappOutlinedRadio;
  }
}

/**
 * @final
 * @suppress {visibility}
 */
@customElement('lapp-outlined-radio')
export class LappOutlinedRadio extends OutlinedRadio {
  static override styles: CSSResult[] = [
    ...MdOutlinedTextField.styles, 
    outlinedStyles, 
    sharedStyles,
    genericStyles,
    choiceStyles
  ];
}
