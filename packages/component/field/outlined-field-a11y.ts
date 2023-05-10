/**
 * @license
 * Copyright 2021 Google LLC
 * SPDX-License-Identifier: Apache-2.0
 */

import {customElement} from 'lit/decorators.js';

import {OutlinedFieldA11y} from './lib/outlined-field-a11y.js';
import {MdOutlinedField} from '@material/web/field/outlined-field.js'


declare global {
  interface HTMLElementTagNameMap {
    'lap-outlined-field-a11y': LapOutlinedFieldA11y;
  }
}

/**
 * TODO(b/228525797): add docs
 * @final
 * @suppress {visibility}
 */
@customElement('lap-outlined-field-a11y')
export class LapOutlinedFieldA11y extends OutlinedFieldA11y {
  static override styles= MdOutlinedField.styles;
}
