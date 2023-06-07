import '../../../field/filled-field.js';

import {literal} from 'lit/static-html.js';

import {Star} from './star';

/**
 * An filled text field component
 */
export class FilledStar extends Star {
  protected readonly fieldTag = literal`lapp-filled-field`;
}
