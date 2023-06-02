/**
 * @license
 * Copyright 2022 Google LLC
 * SPDX-License-Identifier: Apache-2.0
 */

import {customElement} from 'lit/decorators.js';


import {MdRadio} from '@material/web/radio/radio';


declare global {
  interface HTMLElementTagNameMap {
    'lap-radio': LapRadio;
  }
}

/**
 * @summary Radio buttons allow users to select one option from a set.
 *
 * @description
 * Radio buttons are the recommended way to allow users to make a single
 * selection from a list of options.
 *
 * Only one radio button can be selected at a time.
 *
 * Use radio buttons to:
 * - Select a single option from a set
 * - Expose all available options
 *
 * @final
 * @suppress {visibility}
 */
@customElement('lap-radio')
export class LapRadio extends MdRadio {
  // static override styles= [styles, forcedColorsStyles];
}
