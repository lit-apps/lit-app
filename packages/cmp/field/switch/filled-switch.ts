import { MdFilledTextField } from '@material/web/textfield/filled-text-field.js';
import { customElement } from 'lit/decorators.js';
import genericStyles from '../generic/styles.js';
import filledStyles from './filledStyles.js';
import { FilledSwitch } from './internal/filled-switch.js';
import sharedStyles from './sharedStyles.js';
declare global {
  interface HTMLElementTagNameMap {
    'lapp-filled-switch-field': LappFilledSwitch;
  }
}

/**
 * @final
 * @suppress {visibility}
 */
@customElement('lapp-filled-switch-field')
export class LappFilledSwitch extends FilledSwitch {
  static override styles = [
    ...MdFilledTextField.styles,
    filledStyles,
    genericStyles,
    sharedStyles
  ];
}
