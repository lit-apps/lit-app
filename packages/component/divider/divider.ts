/**
 * @license
 * Copyright 2023 Google LLC
 * SPDX-License-Identifier: Apache-2.0
 */

import {customElement} from 'lit/decorators.js';

import {Divider} from './lib/divider.js';


declare global {
  interface HTMLElementTagNameMap {
    'lapp-divider': MdDivider;
  }
}

/**
 * @summary A divider is a thin line that groups content in lists and
 * containers.
 *
 * @description Dividers can reinforce tapability, such as when used to separate
 * list items or define tappable regions in an accordion.
 *
 * @final
 * @suppress {visibility}
 */
@customElement('lapp-divider')
export class MdDivider extends Divider {
  // static override styles= [styles];
}
