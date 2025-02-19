import { literal } from 'lit/static-html.js';
import '../../field/filled-field.js';

import { Switch } from './switch.js';

/**
 * An filled text field component
 */
export class FilledSwitch extends Switch {
  protected override readonly fieldTag = literal`lapp-filled-field`;
}
