import { customElement } from 'lit/decorators.js';
import { FilledUpload } from './internal/filled-upload.js';
import filledStyles from './filledStyles.js';
import sharedStyles from './sharedStyles.js';
import { MdFilledTextField } from '@material/web/textfield/filled-text-field.js'
import genericStyles from '../generic/styles.js';
declare global {
  interface HTMLElementTagNameMap {
    'lapp-filled-upload-field': LappFilledUpload;
  }
}

/**
 * @final
 * @suppress {visibility}
 */
@customElement('lapp-filled-upload-field')
export class LappFilledUpload extends FilledUpload {
  static override styles = [
    ...MdFilledTextField.styles,
    filledStyles,
    genericStyles, 
    sharedStyles
  ];
}
