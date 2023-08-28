/**
 * @license
 * Copyright 2022 Google LLC
 * SPDX-License-Identifier: Apache-2.0
 */

import {customElement} from 'lit/decorators.js';
import { css } from 'lit';

import {MdListItem} from '@material/web/list/list-item';
import illustrationVariant from './internal/illustrationVariantStyles';

declare global {
  interface HTMLElementTagNameMap {
    'lapp-list-item': LappListItem;
  }
}

/**
 * @summary
 * Lists are continuous, vertical indexes of text or images. Items are placed
 * inside the list.
 *
 * This implementation of list item is based on MdListItem. It adds support for
 * illustration variant with wider images (useful in accessiblesurveys).
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
 * - `lapp-icon[data-variant=icon]`
 *
 *  @example
 * ```html
 * <lapp-list-item
 *    data-variant="illustration"
 *    headline="User Name"
 *    supportingText="user@name.com">
 *   <lapp-icon data-variant="icon" slot="start">account_circle</lapp-icon>
 *   <lapp-icon data-variant="icon" slot="end">check</lapp-icon>
 * </lapp-list-item>
 * ```
 *
 * @example
 *
 * @final
 * @suppress {visibility}
 */
@customElement('lapp-list-item')
export class LappListItem extends MdListItem {
  static override styles = [
    ...MdListItem.styles, 
    illustrationVariant, 
    css`
    :host {
      display: flex;
    }
    `
  ];
}
