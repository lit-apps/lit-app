/**
 * @license
 * Copyright 2021 Google LLC
 * SPDX-License-Identifier: Apache-2.0
 */

import {customElement} from 'lit/decorators.js';

import { MdFilledTextField } from '@material/web/textfield/filled-text-field.js'
import filledStyles from './filledStyles';
import {FilledCheckbox} from './internal/filled-checkbox.js';
import genericStyles from '../../generic/styles';
import choiceStyles from '../styles';
import sharedStyles from './internal/shared-styles';
import { CSSResult } from 'lit';

declare global {
  interface HTMLElementTagNameMap {
    'lapp-filled-checkbox': LappFilledCheckbox;
  }
}

/**
 * @final
 * @suppress {visibility}
 */
@customElement('lapp-filled-checkbox')
export class LappFilledCheckbox extends FilledCheckbox {
  static styles: CSSResult[] = [
    ...MdFilledTextField.styles, 
    filledStyles,
    sharedStyles,
    choiceStyles, 
    genericStyles
  ];
}
