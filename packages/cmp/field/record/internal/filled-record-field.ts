import '../../field/filled-field.js';

import {literal} from 'lit/static-html.js';

import {RecordField} from './record-field';

/**
 * An filled text field component
 */
export class FilledRecordField extends RecordField {
  protected readonly fieldTag = literal`lapp-filled-field`;
}