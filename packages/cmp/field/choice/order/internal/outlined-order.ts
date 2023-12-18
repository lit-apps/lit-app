import '../../../field/outlined-field.js';

import {literal} from 'lit/static-html.js';

import {Order} from './order';

/**
 * An outlined text field component
 */
export class OutlinedOrder extends Order {
  protected readonly fieldTag = literal`lapp-outlined-field`;
}
