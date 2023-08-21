import '../../field/filled-field.js';
import {literal} from 'lit/static-html.js';

import {Slider} from './slider';

/**
 * An filled text field component
 */
export class FilledSlider extends Slider {
  protected readonly fieldTag = literal`lapp-filled-field`;
}
