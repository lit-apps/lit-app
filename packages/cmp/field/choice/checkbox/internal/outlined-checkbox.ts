

/**
 * @license
 * Copyright 2021 Google LLC
 * SPDX-License-Identifier: Apache-2.0
 */

import '@lit-app/field/outlined-field.js';

import {literal} from 'lit/static-html.js';

import {Checkbox} from './checkbox';

/**
 * An outlined text field component
 */
export class OutlinedCheckbox extends Checkbox {
  protected readonly fieldTag = literal`lapp-outlined-field`;
}
