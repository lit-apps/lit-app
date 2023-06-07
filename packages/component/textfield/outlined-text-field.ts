
import '../field/outlined-field.js';

import { customElement } from 'lit/decorators.js';
import { literal } from 'lit/static-html.js';


import { OutlinedTextField } from './lib/outlined-text-field.js';
import { MdOutlinedTextField } from '@material/web/textfield/outlined-text-field.js'


declare global {
  interface HTMLElementTagNameMap {
    'lapp-outlined-text-field': LapOutlinedTextField;
  }
}

/**
 * TODO(b/228525797): Add docs
 * @final
 * @suppress {visibility}
 */
@customElement('lapp-outlined-text-field')
export class LapOutlinedTextField extends OutlinedTextField {
  static override styles = MdOutlinedTextField.styles;
  protected override readonly fieldTag = literal`lapp-outlined-field`;
}
