import '../../../field/filled-field.js';

import {literal} from 'lit/static-html.js';

import {Order} from './order';

/**
 * An filled text field component
 */
export class FilledOrder extends Order {
  protected readonly fieldTag = literal`lapp-filled-field`;
}
