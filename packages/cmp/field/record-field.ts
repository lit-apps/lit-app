
import { customElement } from 'lit/decorators.js';

import { LappFilledRecordField } from './record/filled-record-field';

declare global {
  interface HTMLElementTagNameMap {
    'lapp-record-field': LappRecordField;
  }
}

/**
 * # record 
 * 
 * @summary
 * Record is a component that display allow to register a record and store it locally.
 
 * @final
 */
@customElement('lapp-record-field')
export class LappRecordField extends LappFilledRecordField {
 
}

