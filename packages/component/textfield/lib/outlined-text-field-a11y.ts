/**
 * @license
 * Copyright 2021 Google LLC
 * SPDX-License-Identifier: Apache-2.0
 */

import '../../field/outlined-field-a11y.js';

import {literal} from 'lit/static-html.js';

import {TextField} from './text-field.js';

/**
 * An outlined text field component
 */
export class OutlinedTextFieldA11y extends TextField {
  protected readonly fieldTag = literal`md-outlined-field-a11y`;
}
