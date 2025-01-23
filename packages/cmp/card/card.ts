
// @ts-nocheck


import { Card } from '@vaadin/card';
import { css, html } from 'lit';

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

  static override shadowRootOptions: ShadowRootInit = {
    mode: 'open' as const,
    delegatesFocus: true,
  };

  static override get styles() {
    return [
      Card.styles,
      css`
      /* We have to re-adjust the layout */
      a {
        text-decoration: none;
        color: inherit;
        display: flex;
        gap: var(--_gap);
        flex-direction: column;
        flex: 1;
        cursor: pointer;
      }
      a:focus {
        outline: none;
      }

       /* Horizontal */
        :host([theme~='horizontal']) a {
        display: grid;
        grid-template-columns: repeat(var(--_media), minmax(auto, max-content)) 1fr;
        align-items: start;
      }

      :host([theme~='horizontal'][_f]) a {
        grid-template-rows: 1fr auto;
      }

      :host([theme~='horizontal'][_c]) a {
        grid-template-rows: repeat(var(--_header), auto) 1fr;
      }

      ` ]
  }

  /**
   * The href attribute of the card
   */
  @property() href!: string;

  /**
  * Where to display the linked `href` URL for a link button. Common options
  * include `_blank` to open in a new tab.
  */
  @property() target!: '_blank' | '_parent' | '_self' | '_top' | '';

  override render() {
    const card = super.render();
    if (this.href) {
      return html`
      <a href="${this.href}" id="link" target = ${ifDefined(this.target)} >
        ${card}
      </a>
      <md-focus-ring for="link" style = "--md-focus-ring-shape: var(--vaadin-card-border-radius)" > </md-focus-ring>
        `;
    }
    return card;
  }
}

declare global {
  interface HTMLElementTagNameMap {
    'lapp-card': lappCard;
  }
}
