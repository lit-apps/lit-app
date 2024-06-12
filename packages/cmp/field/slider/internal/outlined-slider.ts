

import '../../field/outlined-field.js';
import {literal} from 'lit/static-html.js';

import {Slider} from './slider';

/**
 * An outlined text field component
 */
export class OutlinedSlider extends Slider {
  protected override  readonly fieldTag = literal`lapp-outlined-field`;
}
