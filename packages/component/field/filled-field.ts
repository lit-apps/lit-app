/**
 * @license
 * Copyright 2021 Google LLC
 * SPDX-License-Identifier: Apache-2.0
 */

import {customElement} from 'lit/decorators.js';

import {FilledField} from './lib/filled-field.js';
import {MdFilledField} from '@material/web/field/filled-field.js'


declare global {
  interface HTMLElementTagNameMap {
    'lap-filled-field': LapFilledField;
  }
}

/**
 * TODO(b/228525797): add docs
 * @final
 * @suppress {visibility}
 */
@customElement('lap-filled-field')
export class LapFilledField extends FilledField {
  static override styles= MdFilledField.styles;
}
