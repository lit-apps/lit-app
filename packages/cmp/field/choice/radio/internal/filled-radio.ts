import '../../../field/filled-field.js';

import {literal} from 'lit/static-html.js';

import {Radio} from './radio';

/**
 * An filled text field component
 */
export class FilledRadio extends Radio {
  protected readonly fieldTag = literal`lapp-filled-field`;
}
