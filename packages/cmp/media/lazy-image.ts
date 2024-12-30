import { html, css, LitElement } from "lit";
import { customElement, property } from 'lit/decorators.js';
import { IntersectionController } from '@lit-labs/observers/intersection-controller.js';

// returns isIntesecting property
const isIntersecting = ({ isIntersecting }: { isIntersecting: boolean }) => isIntersecting;

/**
 * A custom element that lazily loads an image using the Intersection Observer API.
 * 
 * It is a re-implementation of https://github.com/bennypowers/lazy-image, 
 * 
 * @element lapp-lazy-image
 * 
 * @cssprop --lazy-image-fade-duration - Duration of the fade transition for the image.
 * @cssprop --lazy-image-fade-easing - Easing function for the fade transition.
 * @cssprop --lazy-image-fit - Object-fit property for the image.
 * @cssprop --lazy-image-width - Width of the image.
 * @cssprop --lazy-image-height - Height of the image.
 * 
 * @slot placeholder - Slot for the placeholder content to be displayed while the image is loading.
 * 
 * @fires loaded-changed - Dispatched when the image has finished loading.
 * 
 * @property {string} alt - The alt text for the image.
 * @property {string} src - The URI of the image.
 * @property {boolean} loaded - Reflects whether the image has loaded.
 */
@customElement('lapp-lazy-image')
export default class LappLazyImage extends LitElement {
  private _observer = new IntersectionController(this, {
    config: {
      rootMargin: '10px'
    },
    callback: (entries) => {
      return entries.some(isIntersecting);
    }
  });

  static override styles = css`
      :host {
        position: relative;
      }

      #image,
      #placeholder ::slotted(*) {
        position: absolute;
        top: 0;
        left: 0;
        transition:
          opacity
          var(--lazy-image-fade-duration, 0.3s)
          var(--lazy-image-fade-easing, ease);
        object-fit: var(--lazy-image-fit, contain);
        width: var(--lazy-image-width, 100%);
        height: var(--lazy-image-height, 100%);
      }

      #placeholder ::slotted(*),
      :host([loaded]) #image {
        opacity: 1;
      }

      #image,
      :host([loaded]) #placeholder ::slotted(*) {
        opacity: 0;
      }
    `;

  /** Image alt-text. */
  @property() alt!: string;

  /** Image URI. */
  @property() src!: string;

  /** Whether the image has loaded. */
  @property({ type: Boolean, reflect: true }) loaded: boolean = false;


  override render() {
    return html`
      <div id="placeholder" aria-hidden="${this._observer.value ? 'false' : 'true'}">
        <slot name="placeholder"></slot>
      </div>

      <img id="image"
        aria-hidden="${this._observer.value ? 'false' : 'true'}"
        .src=${this._observer.value ? this.src : ''}
        alt="${this.alt}"
        @load=${this.onLoad}
      />
    `;
  }
  override connectedCallback() {
    super.connectedCallback();
    // Remove the wrapping `<lazy-image>` element from the a11y tree.
    this.setAttribute('role', 'presentation');
  }

  /**
   * Sets the `loaded` property when the image is finished loading.
   */
  protected onLoad() {
    this.loaded = true;
    // Dispatch and event that supports Polymer two-way binding.
    const bubbles = true;
    const composed = true;
    const detail = { value: true };
    this.dispatchEvent(new CustomEvent('loaded-changed', {
      bubbles,
      composed,
      detail
    }));
  }
}

declare global {
  interface HTMLElementTagNameMap {
    'lapp-lazy-image': LappLazyImage;
  }
}
