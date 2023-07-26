/**
 * @license
 * Copyright 2021 Google LLC
 * SPDX-License-Identifier: Apache-2.0
 */

import {customElement} from 'lit/decorators.js';

import {OutlinedField} from './internal/outlined-field.js';
import {MdOutlinedField} from '@material/web/field/outlined-field.js'


declare global {
  interface HTMLElementTagNameMap {
    'lapp-outlined-field': LappOutlinedField;
  }
}

/**
 * TODO(b/228525797): add docs
 * @final
 * @suppress {visibility}
 */
@customElement('lapp-outlined-field')
export class LappOutlinedField extends OutlinedField {
   static override styles= MdOutlinedField.styles;
}
