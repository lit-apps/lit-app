import '../../field/filled-field.js';
import {literal} from 'lit/static-html.js';

import {Checkbox} from './checkbox';

/**
 * An filled text field component
 */
export class FilledCheckbox extends Checkbox {
  protected readonly fieldTag = literal`lapp-filled-field`;
}
