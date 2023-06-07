/**
 * @license
 * Copyright 2023 Google LLC
 * SPDX-License-Identifier: Apache-2.0
 */

import {customElement} from 'lit/decorators.js';


import {Slider} from './lib/slider.js';


declare global {
  interface HTMLElementTagNameMap {
    'lapp-slider': MdSlider;
  }
}

/**
 * @summary Sliders allow users to view and select a value (or range) along
 * a track.
 *
 * @description
 * Changes made with sliders are immediate, allowing the user to make slider
 * adjustments while determining a selection. Sliders shouldn’t be used to
 * adjust settings with any delay in providing user feedback. Sliders reflect
 * the current state of the settings they control.
 *
 * __Example usages:__
 * - Sliders are ideal for adjusting settings such as volume and brightness, or
 * for applying image filters.
 */
@customElement('lapp-slider')
export class MdSlider extends Slider {
  // static override styles= [styles, forcedColorsStyles];
}
