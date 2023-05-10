/**
 * @license
 * Copyright 2021 Google LLC
 * SPDX-License-Identifier: Apache-2.0
 */

import '../../field/filled-field-a11y.js';

import {literal} from 'lit/static-html.js';

import {TextField} from './text-field.js';

/**
 * An filled text field component
 */
export class FilledTextFieldA11y extends TextField {
  protected readonly fieldTag = literal`md-filled-field-a11y`;
}
