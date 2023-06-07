/**
 * @license
 * Copyright 2022 Google LLC
 * SPDX-License-Identifier: Apache-2.0
 */

import {customElement} from 'lit/decorators.js';


import {MdListItem} from '@material/web/list/list-item';
import illustrationVariant from './lib/illustrationVariantStyles';

declare global {
  interface HTMLElementTagNameMap {
    'lapp-list-item': LapListItem;
  }
}

/**
 * @summary
 * Lists are continuous, vertical indexes of text or images. Items are placed
 * inside the list.
 *
 * @description
 * Lists consist of one or more list items, and can contain actions represented
 * by icons and text. List items come in three sizes: one-line, two-line, and
 * three-line.
 *
 * __Takeaways:__
 *
 * - Lists should be sorted in logical ways that make content easy to scan, such
 *   as alphabetical, numerical, chronological, or by user preference.
 * - Lists present content in a way that makes it easy to identify a specific
 *   item in a collection and act on it.
 * - Lists should present icons, text, and actions in a consistent format.
 *
 * Acceptable slottable child variants are:
 *
 * - `video[data-variant=video]`
 * - `img,span[data-variant=avatar]`
 * - `img[data-variant=image]`
 * - `md-icon[data-variant=icon]`
 *
 *  @example
 * ```html
 * <md-list-item
 *     headline="User Name"
 *     supportingText="user@name.com">
 *   <md-icon data-variant="icon" slot="start">account_circle</md-icon>
 *   <md-icon data-variant="icon" slot="end">check</md-icon>
 * </md-list-item>
 * ```
 *
 * @example
 *
 * @final
 * @suppress {visibility}
 */
@customElement('lapp-list-item')
export class LapListItem extends MdListItem {
  static override styles = [
    ...MdListItem.styles, 
    illustrationVariant
  ];
}
