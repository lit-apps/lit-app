/**
 * @license
 * Copyright 2021 Google LLC
 * SPDX-License-Identifier: Apache-2.0
 */

import { customElement, property } from 'lit/decorators.js';
import { html, literal } from 'lit/static-html.js';
import { LitElement, css } from 'lit';
import { when } from 'lit/directives/when.js';

import './filled-button'
import './tonal-button'
import './outlined-button'
import './text-button'
import '@material/web/circularprogress/circular-progress'

const filledTag = literal`lap-filled-button`;
const outlineTag = literal`lap-outlined-button`;
const tonalTag = literal`lap-tonal-button`;
const defaultTag = literal`lap-text-button`;

const style = css`
  :host {
    --lap-icon-size: 24px;
    --md-circular-progress-size: var(--lap-icon-size);
    --md-outlined-button-with-icon-icon-size: var(--lap-icon-size);
    --md-text-button-with-icon-icon-size: var(--lap-icon-size);
    --md-filled-button-with-icon-icon-size: var(--lap-icon-size);
    --md-tonal-button-with-icon-icon-size: var(--lap-icon-size);
  }
  `

declare global {
  interface HTMLElementTagNameMap {
    'lap-button': LapButton;
  }
}

/**
 * A generic button to ease migration from MD2
 */
@customElement('lap-button')
export class LapButton extends LitElement {

  static override styles = [style];
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
  
  @property() loading!: boolean;

  override render() {
    const tagName = this.unelevated ? filledTag : this.tonal ? tonalTag : this.outlined ? outlineTag : defaultTag;
    
    // TODO: add aria-support for when loading button
    return html`<${tagName}
			.disabled=${this.disabled}
			.href=${this.href}
			.target=${this.target}
			.trailingIcon=${this.trailingIcon}
			.preventClickDefault=${this.preventClickDefault}
		>
      <slot></slot>
      ${when(this.icon && !this.loading, () => html`<md-icon slot="icon">${this.icon}</md-icon>`)} 
      ${when(this.loading, () => html`<md-circular-progress indeterminate  slot="icon"></md-circular-progress>`)} 
    </${tagName}>`
  }
}
