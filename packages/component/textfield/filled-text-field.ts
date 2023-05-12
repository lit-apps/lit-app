
import '../field/filled-field.js';

import { customElement } from 'lit/decorators.js';
import { literal } from 'lit/static-html.js';


import { FilledTextField } from './lib/filled-text-field.js';
import { MdFilledTextField } from '@material/web/textfield/filled-text-field.js'


declare global {
  interface HTMLElementTagNameMap {
    'lap-filled-text-field': LapFilledTextField;
  }
}

/**
 * TODO(b/228525797): Add docs
 * @final
 * @suppress {visibility}
 */
@customElement('lap-filled-text-field')
export class LapFilledTextField extends FilledTextField {
  static override styles = MdFilledTextField.styles;
  protected override readonly fieldTag = literal`lap-filled-field`;
}
