/**
 * @license
 * Copyright 2021 Google LLC
 * SPDX-License-Identifier: Apache-2.0
 */

import '../field/filled-field-a11y.js';

import {customElement} from 'lit/decorators.js';
import {literal} from 'lit/static-html.js';


import {FilledTextFieldA11y} from './lib/filled-text-field-a11y.js';
import {MdFilledTextField} from '@material/web/textfield/filled-text-field.js'

declare global {
  interface HTMLElementTagNameMap {
    'lap-filled-text-field-a11y': LapFilledTextFieldA11y;
  }
}

/**
 * TODO(b/228525797): Add docs
 * @final
 * @suppress {visibility}
 */
@customElement('lap-filled-text-field')
export class LapFilledTextFieldA11y extends FilledTextFieldA11y {
  static override styles= MdFilledTextField.styles;
  protected override readonly fieldTag = literal`md-filled-field-a11y`;
}
