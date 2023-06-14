/**
 * @license
 * Copyright 2023 Google LLC
 * SPDX-License-Identifier: Apache-2.0
 */

import '../../field/outlined-field.js';
import {literal} from 'lit/static-html.js';

import {TextField} from './text-field.js';

// tslint:disable-next-line:enforce-comments-on-exported-symbols
export abstract class OutlinedTextField extends TextField {
  protected readonly fieldTag = literal`lapp-outlined-field`;
}
