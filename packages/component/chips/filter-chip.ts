/**
 * @license
 * Copyright 2023 Google LLC
 * SPDX-License-Identifier: Apache-2.0
 */

import {customElement} from 'lit/decorators.js';

import {FilterChip} from './lib/filter-chip.js';



declare global {
  interface HTMLElementTagNameMap {
    'lapp-filter-chip': MdFilterChip;
  }
}

/**
 * TODO(b/243982145): add docs
 *
 * @final
 * @suppress {visibility}
 */
@customElement('lapp-filter-chip')
export class MdFilterChip extends FilterChip {
  // static override styles= [sharedStyles, styles];
}
