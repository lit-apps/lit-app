

import '../../../field/outlined-field.js';

import {literal} from 'lit/static-html.js';

import {Star} from './star';

/**
 * An outlined text field component
 */
export class OutlinedStar extends Star {
  protected readonly fieldTag = literal`lapp-outlined-field`;
}
