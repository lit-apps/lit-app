/**
 * @license
 * Copyright 2021 Google LLC
 * SPDX-License-Identifier: Apache-2.0
 */

import {customElement} from 'lit/decorators.js';

import {FilledFieldA11y} from './lib/filled-field-a11y.js';
import {MdFilledField} from '@material/web/field/filled-field.js'


declare global {
  interface HTMLElementTagNameMap {
    'lap-filled-field-a11y': LapFilledFieldA11y;
  }
}

/**
 * TODO(b/228525797): add docs
 * @final
 * @suppress {visibility}
 */
@customElement('lap-filled-field-a11y')
export class LapFilledFieldA11y extends FilledFieldA11y {
  static override styles= MdFilledField.styles;
}
