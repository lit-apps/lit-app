
/**
 * @license
 * Copyright 2021 Google LLC
 * SPDX-License-Identifier: Apache-2.0
 */

import {customElement} from 'lit/decorators.js';

import { MdOutlinedTextField } from '@material/web/textfield/outlined-text-field.js'
import {OutlinedCheckbox} from './lib/outlined-checkbox.js';
import outlinedStyles from './outlinedStyles';
import genericStyles from '../../generic/styles';
import choiceStyles from '../styles';
import { CSSResult } from 'lit';

declare global {
  interface HTMLElementTagNameMap {
    'lapp-outlined-checkbox': LappOutlinedCheckbox;
  }
}

/**
 * @final
 * @suppress {visibility}
 */
@customElement('lapp-outlined-checkbox')
export class LappOutlinedCheckbox extends OutlinedCheckbox {
  static override styles: CSSResult[] = [
    ...MdOutlinedTextField.styles, 
    outlinedStyles,
    choiceStyles, 
    genericStyles
  ];
}
