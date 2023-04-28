/**
 * @license
 * Copyright 2021 Google LLC
 * SPDX-License-Identifier: Apache-2.0
 */

import '../field/outlined-field.js';

import {customElement} from 'lit/decorators.js';
import {literal} from 'lit/static-html.js';



import {OutlinedTextField} from './lib/outlined-text-field.js';


export {TextFieldType} from './lib/text-field.js';

declare global {
  interface HTMLElementTagNameMap {
    'lap-outlined-text-field': MdOutlinedTextField;
  }
}

/**
 * TODO(b/228525797): Add docs
 * @final
 * @suppress {visibility}
 */
@customElement('lap-outlined-text-field')
export class MdOutlinedTextField extends OutlinedTextField {
  // static override styles=
      [sharedStyles, outlinedStyles, outlinedForcedColorsStyles];

  protected override readonly fieldTag = literal`md-outlined-field`;
}
