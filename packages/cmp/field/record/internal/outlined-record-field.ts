

import '../../field/outlined-field.js';

import {literal} from 'lit/static-html.js';

import {RecordField} from './record-field';

/**
 * An outlined text field component
 */
export class OutlinedRecordField extends RecordField {
  protected readonly fieldTag = literal`lapp-outlined-field`;
}