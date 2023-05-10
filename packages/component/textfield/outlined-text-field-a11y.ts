/**
 * @license
 * Copyright 2021 Google LLC
 * SPDX-License-Identifier: Apache-2.0
 */

import '../field/outlined-field-a11y.js';

import {customElement} from 'lit/decorators.js';
import {literal} from 'lit/static-html.js';



import {OutlinedTextFieldA11y} from './lib/outlined-text-field-a11y.js';
import {MdOutlinedTextField} from '@material/web/textfield/outlined-text-field.js'


declare global {
  interface HTMLElementTagNameMap {
    'lap-outlined-text-field-a11y': LapOutlinedTextFieldA11y;
  }
}

/**
 * TODO(b/228525797): Add docs
 * @final
 * @suppress {visibility}
 */
@customElement('lap-outlined-text-field')
export class LapOutlinedTextFieldA11y extends OutlinedTextFieldA11y {
  static override styles= MdOutlinedTextField.styles;
  protected override readonly fieldTag = literal`md-outlined-field-a11y`;
}
