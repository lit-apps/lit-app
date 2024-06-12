/**
 * @license
 * Copyright 2023 Google LLC
 * SPDX-License-Identifier: Apache-2.0
 */

import '../../field/filled-field.js';

import {literal} from 'lit/static-html.js';

import {TextField} from './text-field.js';


// tslint:disable-next-line:enforce-comments-on-exported-symbols
export abstract class FilledTextField extends TextField {
  protected override readonly fieldTag = literal`lapp-filled-field`;
}
