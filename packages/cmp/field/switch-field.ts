
import { customElement } from 'lit/decorators.js';
import { LappFilledSwitch } from './switch/filled-switch';

declare global {
  interface HTMLElementTagNameMap {
    'lapp-switch-field': LappSwitchField;
  }
}

/**
 * # Switch 
 * 
 * @summary
 * Switch is a component that display allow to register a Switch and store it locally.
 
 * @final
 */
@customElement('lapp-switch-field')
export class LappSwitchField extends LappFilledSwitch {

}

