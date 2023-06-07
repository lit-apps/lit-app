/**
 * @license
 * Copyright 2023 Google LLC
 * SPDX-License-Identifier: Apache-2.0
 */

import {customElement} from 'lit/decorators.js';

import {AssistChip} from './lib/assist-chip.js';



declare global {
  interface HTMLElementTagNameMap {
    'lapp-assist-chip': MdAssistChip;
  }
}

/**
 * TODO(b/243982145): add docs
 *
 * @final
 * @suppress {visibility}
 */
@customElement('lapp-assist-chip')
export class MdAssistChip extends AssistChip {
  // static override styles= [sharedStyles, styles];
}
