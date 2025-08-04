/**
 * @license
 * Copyright 2022 Google LLC
 * SPDX-License-Identifier: Apache-2.0
 */

import { css, nothing } from 'lit';
import { customElement } from 'lit/decorators.js';

import { ARIAMixinStrict } from '@material/web/internal/aria/aria';
import { MdListItem } from '@material/web/list/list-item';
import { classMap } from 'lit/directives/class-map.js';
import { literal, html as staticHtml, StaticValue } from 'lit/static-html.js';
import illustrationVariant from './internal/illustrationVariantStyles';

declare global {
  interface HTMLElementTagNameMap {
    'lapp-list-item': LappListItem;
  }
}

/**
 * Override of @material/web.md-list-item to add custom styles and allow to set role 
 * attribute to listitem.
 * 
 * role is set via dataset.role attribute.
 */
@customElement('lapp-list-item')
export class LappListItem extends MdListItem {
  static override styles = [
    ...MdListItem.styles,
    illustrationVariant,
    css`
      :host(:not([disabled])) {
        cursor: pointer;
      }
      md-item {
        overflow: unset;
      }
      `

  ];

  /**
 * Renders the root list item.
 *
 * @param content the child content of the list item.
 */
  protected override renderListItem(content: unknown) {
    const isAnchor = this.type === 'link';
    let tag: StaticValue;
    switch (this.type) {
      case 'link':
        tag = literal`a`;
        break;
      case 'button':
        tag = literal`button`;
        break;
      default:
      case 'text':
        tag = literal`li`;
        break;
    }

    const isInteractive = this.type !== 'text';
    // TODO(b/265339866): announce "button"/"link" inside of a list item. Until
    // then all are "listitem" roles for correct announcement.
    const target = isAnchor && !!this.target ? this.target : nothing;

    // @ts-expect-error - isDisabled is private
    const isDisabled = this.isDisabled
    const role = this.dataset.role || 'listitem';
    return staticHtml`
        <${tag}
          id="item"
          tabindex="${isDisabled || !isInteractive ? -1 : 0}"
          ?disabled=${isDisabled}
          role=${role}
          aria-selected=${(this as ARIAMixinStrict).ariaSelected || nothing}
          aria-checked=${(this as ARIAMixinStrict).ariaChecked || nothing}
          aria-expanded=${(this as ARIAMixinStrict).ariaExpanded || nothing}
          aria-haspopup=${(this as ARIAMixinStrict).ariaHasPopup || nothing}
          class="list-item ${classMap(this.getRenderClasses())}"
          href=${this.href || nothing}
          target=${target}
          @focus=${this.onFocus}
        >${content}</${tag}>
      `;
  }
}
