/**
 * @license
 * Copyright 2021 Google LLC
 * SPDX-License-Identifier: Apache-2.0
 */

import {customElement} from 'lit/decorators.js';

import { MdFilledTextField } from '@material/web/textfield/filled-text-field.js'
import filledStyles from './filledStyles';
import {FilledCheckbox} from './lib/filled-checkbox.js';
import genericStyles from '../../generic/styles';
import choiceStyles from '../styles';
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
  static override styles: CSSResult[] = [
    ...MdFilledTextField.styles, 
    filledStyles,
    choiceStyles, 
    genericStyles
  ];
}