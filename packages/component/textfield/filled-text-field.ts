/**
 * @license
 * Copyright 2021 Google LLC
 * SPDX-License-Identifier: Apache-2.0
 */


/**
 * PwiTextField is an override of MD3's filled-textfield for Preignition
 * that adds a couple of additional features to the component.
 * 
 * - [ ] two-way binding, via @value-changed - DEPRECATED
 * - [x] RTL support - hopefully not needed anymore with MD3 as it should be supported out of the box
 * - [x] support for displaying native validation message - provided out of the box by MD3
 * - [ ] improved support for readonly (style and behavior) 
 * - [ ] check validity on blur
 * - [ ] prevent setting value when value is undefined ?
 * - [ ] possibility to listen when field icon is clicked - see https://github.com/material-components/material-components-web-components/issues/2447
 * - [ ] improved support for some aria attributes: aria-errormessage, aria-invalid role and aria-live
 */

/**
 * @license
 * Copyright 2021 Google LLC
 * SPDX-License-Identifier: Apache-2.0
 */

import '../field/filled-field.js';

import {customElement} from 'lit/decorators.js';
import {literal} from 'lit/static-html.js';


import {FilledTextField} from './lib/filled-text-field.js';
import {MdFilledTextField} from '@material/web/textfield/filled-text-field.js'


declare global {
  interface HTMLElementTagNameMap {
    'lap-filled-text-field': LapFilledTextField;
  }
}

/**
 * TODO(b/228525797): Add docs
 * @final
 * @suppress {visibility}
 */
@customElement('lap-filled-text-field')
export class LapFilledTextField extends FilledTextField {
  static override styles= MdFilledTextField.styles;
  protected override readonly fieldTag = literal`md-filled-field`;
}
