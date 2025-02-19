

import { literal } from 'lit/static-html.js';
import '../../field/outlined-field.js';

import { Switch } from './switch.js';

/**
 * An outlined text field component
 */
export class OutlinedSwitch extends Switch {
  protected override readonly fieldTag = literal`lapp-outlined-field`;
}
