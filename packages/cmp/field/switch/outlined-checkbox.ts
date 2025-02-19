
import { customElement } from 'lit/decorators.js';

import { MdOutlinedTextField } from '@material/web/textfield/outlined-text-field.js';
import genericStyles from '../generic/styles';
import { OutlinedSwitch } from './internal/outline-switch.js';
import outlinedStyles from './outlinedStyles';
import sharedStyles from './sharedStyles';

declare global {
  interface HTMLElementTagNameMap {
    'lapp-outlined-switch-field': LappOutlinedSwitch;
  }
}

/**
 * @final
 * @suppress {visibility}
 */
@customElement('lapp-outlined-switch-field')
export class LappOutlinedSwitch extends OutlinedSwitch {
  static override styles = [
    ...MdOutlinedTextField.styles,
    outlinedStyles,
    genericStyles,
    sharedStyles
  ];
}
