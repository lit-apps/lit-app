import { parseInline } from '@lit-app/shared/md/index.js';
import { css, LitElement, nothing } from "lit";
import { customElement, property } from 'lit/decorators.js';
import { literal, html as staticHtml } from 'lit/static-html.js';
import('@material/web/elevation/elevation');



/**
 * A custom web component that extends `LitElement` to create a widget container.
 * 
 * @slot icon - Slot for the icon element.
 * @slot header - Slot for the header content.
 * @slot action - Slot for the action element.
 * @slot - Default slot for the main content of the container.
 * @slot aria-description - Slot for the aria description content.
 * 
 * @csspart header - The header part of the container.
 * @csspart container - The main container part.
 * 
 * @cssprop --lapp-widget-container-icon-color - The color of the icon.
 * @cssprop --lapp-widget-container-icon-size - The size of the icon.
 * @cssprop --lapp-widget-container-color - The color of the container text.
 * @cssprop --lapp-widget-container-container-color - The background color of the container.
 * @cssprop --lapp-widget-container-elevation-level-hover - The elevation level on hover.
 * @cssprop --lapp-widget-container-max-width - The maximum width of the container.
 * @cssprop --lapp-widget-container-min-width - The minimum width of the container.
 * @cssprop --lapp-widget-container-min-height - The minimum height of the container.
 * @cssprop --lapp-widget-container-padding - The padding of the container.
 * @cssprop --lapp-widget-container-elevation-level - The elevation level of the container.
 * @cssprop --lapp-widget-container-header-padding - The padding of the header.
 * @cssprop --space-small - The small space size.
 * @cssprop --space-x-small - The extra small space size.
 * @cssprop --space-xx-small - The double extra small space size.
 * @cssprop --transition-quickly - The quick transition duration.
 * 
 * @property {string} header - The header of the container.
 * @property {string} href - The URL that the link button points to.
 * @property {'_blank' | '_parent' | '_self' | '_top' | ''} target - Where to display the linked `href` URL for a link button.
 * @property {boolean} noTransform - Set true to disable the transform effect on hover.
 * @property {string} accessibleName - The accessible name for the container.
*/
@customElement('lapp-widget-container')
export default class lappWidgetContainer extends LitElement {

  static override styles = css`
    :host {
      --_icon-color: var(--lapp-widget-container-icon-color, var(--color-secondary-text));
      --_icon-size: var(--lapp-widget-container-icon-size, 1.5rem);
      --_color: var(--lapp-widget-container-color, var(--color-on-surface, #1C1B1F));
      --_container-color: var(--lapp-widget-container-container-color, var(--md-sys-color-surface-container-lowe,#f7f2fa));

      display: flex;
      flex-direction: column;
      position: relative;
    }

    :host(:not([noTransform])) .container {
      transform: scale(1);
      will-change: transform, --md-elevation-level;
    }

    :host(:not([noTransform]):hover) .container, 
    :host(:not([noTransform]):active) .container,
    :host(:not([noTransform]):focus) .container {
      --md-elevation-level: var(--lapp-widget-container-elevation-level-hover, 3);
      transform: scale(1.01);
    }

    ::slotted([slot=action]) {
      opacity: 0;
      transition: opacity var(--transition-quickly);
    }
    :host(:not([noTransform]):hover)  ::slotted([slot=action]), 
    :host(:not([noTransform]):active)  ::slotted([slot=action]),
    :host(:not([noTransform]):focus)  ::slotted([slot=action]) {
      opacity: 1;
    }

    ::slotted([slot=icon]),
    ::slotted([slot=action]) {
      display: inline-flex;
      position: relative;
      writing-mode: horizontal-tb;
      fill: currentColor;
      flex-shrink: 0;
      color: var(--_icon-color);
      font-size: var(--_icon-size);
      inline-size: var(--_icon-size);
      block-size: var(--_icon-size);
      gap: var(--space-small);
    }

    ::slotted([slot=icon]) {
      margin-right: var(--space-x-small);
    }
    .title {
      flex: 1;
      white-space: nowrap;
      overflow: hidden;
      width: 0; /* need this for ellipsis work*/
      text-overflow: ellipsis;
      
    }
    .title::first-letter {
      text-transform: uppercase;
    }

    a {
      color: inherit;
      text-decoration: none;
      position: relative;
    }
    .container:focus-visible {
      outline: none;
    }
    .header {
      color: #4a4a4a;
      letter-spacing: 0;
      font-weight: var(--font-weight-semi-bold);
      display: flex;
      align-items: center;
      min-height: 16px;
      padding-bottom: var(--lapp-widget-container-header-padding, var(--space-x-small));
    }

    .container {
      color: var(--_color);      
      background: var(--_container-color);      
      max-width: var(--lapp-widget-container-max-width);
      min-width: var(--lapp-widget-container-min-width, 200px);
      min-height: var(--lapp-widget-container-min-height, 200px);
      padding: var(--lapp-widget-container-padding, 0);
      --md-elevation-level: var(--lapp-widget-container-elevation-level, 1);
      flex: 1;
      position: relative;
      transition: var(--transition-quickly);
      box-sizing: border-box;
      /* background: var(--color-on-primary, #fff); */
      height: 100%;
      border-radius: var(--space-xx-small);
      display: flex;
      cursor: pointer;
      flex-direction: column;
    }

    `;

  /**
   * The header of the container.
   */
  @property() header!: string;

  /**
   * The URL that the link button points to.
   */
  @property() href = '';

  /**
   * Where to display the linked `href` URL for a link button. Common options
   * include `_blank` to open in a new tab.
   */
  @property() target: '_blank' | '_parent' | '_self' | '_top' | '' = '';

  /**
   * set true to disable the transform effect on hover
   */
  @property({ type: Boolean, reflect: true }) noTransform!: boolean

  /**
   * The accessible name for the container
   */
  @property() accessibleName!: string


  override render() {
    const container = this.href ? literal`a` : literal`div`;
    return staticHtml`
      <div class="header" part="header">
        <slot name="icon"></slot>
        <span class="title"><slot name="header">${parseInline(this.header || '')}</slot></span>
        <slot name="action"></slot>
      </div>
      <${container} 
        class="container" 
        part="container"  
        aria-label=${this.accessibleName || this.header || nothing}
        aria-describedby="description"
        href=${this.href || nothing}
        target=${this.target || nothing}> 
        <md-focus-ring style="--md-focus-ring-shape: 8px"></md-focus-ring>
        <slot></slot>
        <md-elevation></md-elevation>
      </${container}>
      <div id="description" hidden><slot name="aria-description"></slot></div>
    `;
  }
}

declare global {
  interface HTMLElementTagNameMap {
    'lapp-widget-container': lappWidgetContainer;
  }
}
