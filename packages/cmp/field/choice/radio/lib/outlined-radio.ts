

import '../../../field/outlined-field.js';

import {literal} from 'lit/static-html.js';

import {Radio} from './radio';

/**
 * An outlined text field component
 */
export class OutlinedRadio extends Radio {
  protected readonly fieldTag = literal`lapp-outlined-field`;
}
