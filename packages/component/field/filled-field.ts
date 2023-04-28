/**
 * @license
 * Copyright 2021 Google LLC
 * SPDX-License-Identifier: Apache-2.0
 */

import {customElement} from 'lit/decorators.js';

import {FilledField} from './lib/filled-field.js';



declare global {
  interface HTMLElementTagNameMap {
    'lap-filled-field': MdFilledField;
  }
}

/**
 * TODO(b/228525797): add docs
 * @final
 * @suppress {visibility}
 */
@customElement('lap-filled-field')
export class MdFilledField extends FilledField {
  // static override styles= [sharedStyles, filledStyles];
}
