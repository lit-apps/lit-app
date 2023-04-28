/**
 * @license
 * Copyright 2021 Google LLC
 * SPDX-License-Identifier: Apache-2.0
 */

import { customElement, property } from 'lit/decorators.js';
import { html, literal } from 'lit/static-html.js';
import { LitElement } from 'lit';
import { when } from 'lit/directives/when.js';

import './filled-button'
import './tonal-button'
import './outlined-button'
import './text-button'

const filledTag = literal`lap-filled-button`;
const outlineTag = literal`lap-outlined-button`;
const tonalTag = literal`lap-tonal-button`;
const defaultTag = literal`lap-text-button`;

declare global {
  interface HTMLElementTagNameMap {
    'lap-button': PcButton;
  }
}

/**
 * A generic button to ease migration from MD2
 */
@customElement('lap-button')
export class PcButton extends LitElement {
  /**
   * Whether or not the button is disabled.
   */
  @property({ type: Boolean, reflect: true }) disabled = false;

  /**
   * The URL that the link button points to.
   */
  @property() href?: string;

  /**
   * Where to display the linked `href` URL for a link button. Common options
   * include `_blank` to open in a new tab.
   */
  @property() target?: string;

  /**
   * Whether to render the icon at the inline end of the label rather than the
   * inline start.
   *
   * _Note:_ Link buttons cannot have trailing icons.
   */
  @property({ type: Boolean }) trailingIcon = false;

  /**
   * Whether `preventDefault()` should be called on the underlying button.
   * Useful for preventing certain native functionalities like preventing form
   * submissions.
   */
  @property({ type: Boolean }) preventClickDefault = false;

  /**
   * True to render a filled-button
   */
  @property() unelevated!: boolean;

  /**
   * True to render a outlined-button
   */
  @property() outlined!: boolean;

  /**
   * True to render a tonal-button
   */
  @property() tonal!: boolean;


  @property() icon!: string;

  override render() {
    const tagName = this.unelevated ? filledTag : this.tonal ? tonalTag : this.outlined ? outlineTag : defaultTag;
    
    return html`<${tagName}
			.disabled=${this.disabled}
			.href=${this.href}
			.target=${this.target}
			.trailingIcon=${this.trailingIcon}
			.preventClickDefault=${this.preventClickDefault}
		>
      <slot></slot>
      ${when(this.icon, () => html`<md-icon slot="icon">${this.icon}</md->`)} 
    </${tagName}>`
  }
}
