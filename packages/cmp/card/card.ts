
// @ts-nocheck


import { Card } from '@vaadin/card';
import { css, html } from 'lit';

import { watch } from '@lit-app/shared/decorator';
import { customElement, property } from 'lit/decorators.js';
import { ifDefined } from 'lit/directives/if-defined.js';


/**
 * A custom card element that extends the `Card` class and provides additional functionality
 * for rendering a link around the card content if the `href` property is set.
 *
 * @customElement lapp-card
 * @extends {Card}
 *
 * @property {string} href - The href attribute of the card. If set, the card content will be wrapped in an anchor tag.
 * @property {'_blank' | '_parent' | '_self' | '_top' | ''} target - Specifies where to display the linked `href` URL for a link button.
 *
 *
 * @shadowRoot open - The shadow root mode is set to 'open' and delegates focus.
 *
 * @example
 * <lapp-card href="https://example.com" target="_blank"></lapp-card>
 */
@customElement('lapp-card')
export default class lappCard extends Card {

  // static override shadowRootOptions: ShadowRootInit = {
  //   mode: 'open' as const,
  //   delegatesFocus: true,
  // };

  static override get styles() {
    return [
      Card.styles,
      css`
      /* We have to re-adjust the layout */
      a {
        display: contents;
        color: inherit;
        text-decoration: none;
        cursor: pointer; 
        border-radius: inherit;
      }

      :host(:focus), a:focus {
        outline: none;
      }
      :host([theme~="hover"]) { 
        transform: scale(1);
        will-change: transform, --vaadin-card-box-shadow;
        transition: all var(--transition-quickly);
      }
      :host([theme~="hover"]:hover) {
        transform: scale(1.015);
        --vaadin-card-box-shadow: var(--lumo-box-shadow-m);
      }
      ` ]
  }

  /**
   * The href attribute of the card
   */
  @property() href!: string;
  @watch('href') _hrefChanged(href) {
    if (href) {
      this.setAttribute('tabindex', '0');
      const focusRing = this.renderRoot.querySelector('md-focus-ring')
      if (focusRing) focusRing.control = this;
    } else {
      this.removeAttribute('tabindex');
    }
  }
  /**
  * Where to display the linked `href` URL for a link button. Common options
  * include `_blank` to open in a new tab.
  */
  @property() target!: '_blank' | '_parent' | '_self' | '_top' | '';

  override render() {
    const card = super.render();
    if (this.href) {
      return html`
      <a href="${this.href}" target = ${ifDefined(this.target)} >
        ${card}
      </a>
      <md-focus-ring style="--md-focus-ring-shape: var(--vaadin-card-border-radius)" > </md-focus-ring>
        `;
    }
    return card;
  }
  override firstUpdated(props) {
    super.firstUpdated(props);
    this._hrefChanged(this.href);
  }
}

declare global {
  interface HTMLElementTagNameMap {
    'lapp-card': lappCard;
  }
}
