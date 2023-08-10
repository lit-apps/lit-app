/**
 * @license
 * Copyright 2021 Google LLC
 * SPDX-License-Identifier: Apache-2.0
 */

import { customElement, property } from 'lit/decorators.js';
import { html, literal } from 'lit/static-html.js';
import { LitElement, css } from 'lit';
import { when } from 'lit/directives/when.js';
import {icon} from '@preignition/preignition-styles';

import '@material/web/button/elevated-button.js';
import '@material/web/button/filled-button.js';
import '@material/web/button/filled-tonal-button.js';
import '@material/web/button/outlined-button.js';
import '@material/web/button/text-button.js';
import '@material/web/progress/circular-progress.js';

const filledTag = literal`md-filled-button`;
const outlineTag = literal`md-outlined-button`;
const tonalTag = literal`md-filled-tonal-button`;
const defaultTag = literal`md-text-button`;

const style = css`
  :host {
    --lapp-icon-size: 24px;
    --md-circular-progress-size: var(--lapp-icon-size);
    --md-outlined-button-icon-size: var(--lapp-icon-size);
    --md-text-button-icon-size: var(--lapp-icon-size);
    --md-filled-button-icon-size: var(--lapp-icon-size);
    --md-filled-tonal-button-icon-size: var(--lapp-icon-size);
    --md-circular-progress-active-indicator-width: 16;
  }
  md-filled-button {
    --md-circular-color: var(--color-on-primary);
    --md-circular-progress-active-indicator-color: var(--color-on-primary);

  }
  `

declare global {
  interface HTMLElementTagNameMap {
    'lapp-button': LappButton;
  }
}

/**
 * A generic button to ease migration from MD2
 */
@customElement('lapp-button')
export class LappButton extends LitElement {

  static override styles = [icon, style];
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
  // @property({ type: Boolean }) preventClickDefault = false;

  /**
   * True to render a filled-button
   */
  @property({type: Boolean}) unelevated!: boolean;

  /**
   * True to render a outlined-button
   */
  @property({type: Boolean}) outlined!: boolean;

  /**
   * True to render a filled-tonal-button
   */
  @property({type: Boolean}) tonal!: boolean;

  @property() icon!: string;

  @property({type: Boolean}) loading!: boolean;

  override render() {
    const tagName = this.unelevated ? filledTag : 
    this.tonal ? tonalTag : 
    this.outlined ? outlineTag : 
    defaultTag;

    // TODO: add aria-support for when loading button
    return html`<${tagName}
			.disabled=${this.disabled}
			.href=${this.href}
			.target=${this.target}
			.trailingIcon=${this.trailingIcon}
			
		>
      <slot></slot>
      ${when(this.icon && !this.loading, () => html`<md-icon slot="icon">${this.icon}</md-icon>`)} 
      ${when(this.loading, () => html`<md-circular-progress indeterminate  slot="icon"></md-circular-progress>`)} 
    </${tagName}>`
  }
}
