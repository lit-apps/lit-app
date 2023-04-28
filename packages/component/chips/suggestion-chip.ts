/**
 * @license
 * Copyright 2023 Google LLC
 * SPDX-License-Identifier: Apache-2.0
 */

import {customElement} from 'lit/decorators.js';


import {SuggestionChip} from './lib/suggestion-chip.js';


declare global {
  interface HTMLElementTagNameMap {
    'lap-suggestion-chip': MdSuggestionChip;
  }
}

/**
 * TODO(b/243982145): add docs
 *
 * @final
 * @suppress {visibility}
 */
@customElement('lap-suggestion-chip')
export class MdSuggestionChip extends SuggestionChip {
  // static override styles= [sharedStyles, styles];
}
