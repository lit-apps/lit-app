import '../../field/filled-field.js';

import {literal} from 'lit/static-html.js';

import {TextfieldSelect} from './textfield-select';

/**
 * An filled text field component
 */
export class FilledTextfieldSelect extends TextfieldSelect {
  protected readonly fieldTag = literal`lapp-filled-field`;
}
