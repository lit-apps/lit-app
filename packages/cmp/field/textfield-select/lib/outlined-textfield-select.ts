

import '../../field/outlined-field.js';

import {literal} from 'lit/static-html.js';

import {TextfieldSelect} from './textfield-select';

/**
 * An outlined text field component
 */
export class OutlinedTextfieldSelect extends TextfieldSelect {
  protected readonly fieldTag = literal`lapp-outlined-field`;
}
