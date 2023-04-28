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

import {customElement} from 'lit/decorators.js';

import {MdFilledTextField} from '@material/web/textfield/filled-text-field';

declare global {
  interface HTMLElementTagNameMap {
    'lap-filled-text-field': LacFilledTextField;
  }
}

/**
 * TODO(b/228525797): Add docs
 * @final
 * @suppress {visibility}
 */
@customElement('lap-filled-text-field')
export class LacFilledTextField extends MdFilledTextField {
  // static override styles=
      // [sharedStyles, filledStyles, filledForcedColorsStyles];

  // protected override readonly fieldTag = literal`md-filled-field`;
}
