
import { customElement } from 'lit/decorators.js';

import styles from './record-styles';
import { Record } from './internal/record';

declare global {
  interface HTMLElementTagNameMap {
    'lapp-record': LappRecord;
  }
}

/**
 * # record  
 * 
 * @summary
 * Record is a component that display allow to register a record and store it locally.
 
 * @final
 */
@customElement('lapp-record')
export class LappRecord extends Record {
  static override styles = [
    styles, 
  ];
}
