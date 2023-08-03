
import { customElement } from 'lit/decorators.js';

import { LappFilledCheckbox } from './checkbox/filled-checkbox';

declare global {
  interface HTMLElementTagNameMap {
    'lapp-checkbox-field': LappCheckboxField;
  }
}

/**
 * # Checkbox 
 * 
 * @summary
 * Checkbox is a component that display allow to register a Checkbox and store it locally.
 
 * @final
 */
@customElement('lapp-checkbox-field')
export class LappCheckboxField extends LappFilledCheckbox {
 
}

