/**
 * @license
 * Copyright 2021 Google LLC
 * SPDX-License-Identifier: Apache-2.0
 */

import {customElement} from 'lit/decorators.js';

import {OutlinedField} from './lib/outlined-field.js';



declare global {
  interface HTMLElementTagNameMap {
    'lap-outlined-field': MdOutlinedField;
  }
}

/**
 * TODO(b/228525797): add docs
 * @final
 * @suppress {visibility}
 */
@customElement('lap-outlined-field')
export class MdOutlinedField extends OutlinedField {
  // static override styles= [sharedStyles, outlinedStyles];
}
