

import '../../field/outlined-field.js';
import {literal} from 'lit/static-html.js';

import {Upload} from './upload';

/**
 * An outlined text field component
 */
export class OutlinedUpload extends Upload {
  protected override  readonly fieldTag = literal`lapp-outlined-field`;
}
