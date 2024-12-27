
import { customElement } from 'lit/decorators.js';

import { OutlinedUpload } from './internal/outlined-upload.js';
import outlinedStyles from './outlinedStyles.js';
import { MdOutlinedTextField } from '@material/web/textfield/outlined-text-field.js'
import genericStyles from '../generic/styles.js';
import sharedStyles from './sharedStyles.js';

declare global {
  interface HTMLElementTagNameMap {
    'lapp-outlined-upload-field': LappOutlinedUpload;
  }
}

/**
 * @final
 * @suppress {visibility}
 */
@customElement('lapp-outlined-upload-field')
export class LappOutlinedUpload extends OutlinedUpload {
  static override  styles  = [
    ...MdOutlinedTextField.styles, 
    outlinedStyles, 
    genericStyles,
    sharedStyles
  ];
}
