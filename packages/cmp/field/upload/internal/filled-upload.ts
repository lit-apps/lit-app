import '../../field/filled-field.js';
import {literal} from 'lit/static-html.js';

import {Upload} from './upload';

/**
 * An filled text field component
 */
export class FilledUpload extends Upload {
  protected override readonly fieldTag = literal`lapp-filled-field`;
}
