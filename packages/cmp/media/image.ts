import { html, css, LitElement, PropertyValues } from "lit";
import { ifDefined } from 'lit/directives/if-defined.js'
import { customElement, property, query, state } from 'lit/decorators.js';

export type sizing = 'cover' | 'contain' | null;
export type position = 'center' | 'top' | 'bottom' | 'left' | 'right' | 'top left' | 'top right' | 'bottom left' | 'bottom right';
type crossorigin = 'anonymous' | 'use-credentials' | undefined;

/**
 * A custom element that extends `LitElement` to provide an image component with various features such as preloading, 
 * placeholders, and sizing options.
 * 
 * It is a rewrite of [iron-image](https://github.com/PolymerElements/iron-image) on lit.
 * 
 * @element lapp-image
 * 
 * @property {string} src - The URL of an image.
 * @property {string | null} alt - A short text alternative for the image.
 * @property {crossorigin} crossorigin - CORS enabled images support.
 * @property {boolean} preventLoad - When true, the image is prevented from loading and any placeholder is shown.
 * @property {sizing} sizing - Sets a sizing option for the image. Valid values are `contain`, `cover`, or `null`.
 * @property {position} position - Determines how the image is aligned within the element bounds when a sizing option is used.
 * @property {boolean} preload - When true, any change to the `src` property will cause the `placeholder` image to be shown until the new image has loaded.
 * @property {string | null} placeholder - This image will be used as a background/placeholder until the src image has loaded.
 * @property {boolean} fade - When `preload` is true, setting `fade` to true will cause the image to fade into place.
 * @property {number} width - Can be used to set the width of the image.
 * @property {number} height - Can be used to set the height of the image.
 * @property {boolean} showOnHover - Use to switch between placeholder and image on hover.
 * 
 * @fires loaded-changed - Dispatched when the `loaded` property changes.
 * @fires loading-changed - Dispatched when the `loading` property changes.
 * @fires error-changed - Dispatched when the `error` property changes.
 * 
 * @cssprop --lapp-image-width - The width of the image.
 * @cssprop --lapp-image-height - The height of the image.
 * @cssprop --time-slow - The duration of the fade transition.
 * 
 * @slot - Default slot for the image content.
 * 
 * Examples:
*
*  Basically identical to `<img src="...">` tag:
*
*    <lapp-image src="http://lorempixel.com/400/400"></lapp-image>
*
*  Will letterbox the image to fit:
*
*    <lapp-image style="width:400px; height:400px;" sizing="contain"
*      src="http://lorempixel.com/600/400"></lapp-image>
*
*  Will crop the image to fit:
*
*    <lapp-image style="width:400px; height:400px;" sizing="cover"
*      src="http://lorempixel.com/600/400"></lapp-image>
*
*  Will show light-gray background until the image loads:
*
*    <lapp-image style="width:400px; height:400px; background-color: lightgray;"
*      sizing="cover" preload src="http://lorempixel.com/600/400"></lapp-image>
*
*  Will show a base-64 encoded placeholder image until the image loads:
*
*    <lapp-image style="width:400px; height:400px;" placeholder="data:image/gif;base64,..."
*      sizing="cover" preload src="http://lorempixel.com/600/400"></lapp-image>
*
*  Will fade the light-gray background out once the image is loaded:
*
*    <lapp-image style="width:400px; height:400px; background-color: lightgray;"
*      sizing="cover" preload fade src="http://lorempixel.com/600/400"></lapp-image>
*/
@customElement('lapp-image')
export class LappImage extends LitElement {
  _resolvedSrc!: string;
  
  // value that is true when the image is loaded.
  loaded: boolean = false;
  
  // value that tracks the loading state of the image when the `preload` option is used.
  loading: boolean = false;
  
  // value that indicates that the last set `src` failed to load.
  error: boolean = false;
  
  static override styles = css`
        :host {
          display: inline-block;
          overflow: hidden;
          position: relative;
        }
  
        #baseURIAnchor {
          display: none;
        }
  
        #sizedImgDiv {
          position: absolute;
          top: 0px;
          right: 0px;
          bottom: 0px;
          left: 0px;
  
          display: none;
        }
  
        #img {
          display: block;
          width: var(--lapp-image-width, auto);
          height: var(--lapp-image-height, auto);
        }
  
        :host([sizing]) #sizedImgDiv {
          display: block;
        }
  
        :host([sizing]) #img {
          display: none;
        }
  
        #placeholder {
          position: absolute;
          top: 0px;
          right: 0px;
          bottom: 0px;
          left: 0px;
  
          background-color: inherit;
          transition: opacity var(--time-slow, 0.5s) linear;
          opacity: 1;
  
        }
  
        #placeholder.faded-out {
          opacity: 0;
        }
    `;

  // The URL of an image.
  @property() src: string = '';

  // A short text alternative for the image.
  @property() alt: string | null = null;

  // CORS enabled images support (https://developer.mozilla.org/en-US/docs/Web/HTML/CORS_enabled_image)
  @property() crossorigin: crossorigin;

  /**
   * When true, the image is prevented from loading and any placeholder is
   * shown.  This may be useful when a binding to the src property is known to
   * be invalid, to prevent 404 requests.
   */
  @property({ type: Boolean }) preventLoad: boolean = false;

  /**
   * Sets a sizing option for the image.  Valid values are `contain` (full
   * aspect ratio of the image is contained within the element and
   * letterboxed) or `cover` (image is cropped in order to fully cover the
   * bounds of the element), or `null` (default: image takes natural size).
   */
  @property({ reflect: true }) sizing: sizing = null;

  /**
   * When a sizing option is used (`cover` or `contain`), this determines
   * how the image is aligned within the element bounds.
   */
  @property() position: position = 'center';

  /**
   * When `true`, any change to the `src` property will cause the
   * `placeholder` image to be shown until the new image has loaded.
   */
  @property({ type: Boolean }) preload: boolean = false;

  /**
   * This image will be used as a background/placeholder until the src image
   * has loaded.  Use of a data-URI for placeholder is encouraged for instant
   * rendering.
   */
  @property() placeholder: string | null = null;

  /**
   * When `preload` is true, setting `fade` to true will cause the image to
   * fade into place.
   */
  @property({ type: Boolean }) fade: boolean = false;

  /**
   * Can be used to set the width of image (e.g. via binding); size may also
   * be set via CSS.
   */
  @property({ type: Number }) width!: number;

  /**
   * Can be used to set the height of image (e.g. via binding); size may also
   * be set via CSS.
   * @type number
   * @default null
   */
  @property({ type: Number }) height!: number;

  /** 
   * Use to switch between placeholder and image on hover
   * This is useful for animated images (gif) that you want to show on hover
   */
  @property({ type: Boolean }) showOnHover: boolean = false;
  @state() showPlaceholder: boolean = true;

  @query('#sizedImgDiv') imgDiv!: HTMLDivElement;
  @query('#img') img!: HTMLImageElement;
  @query('#placeholder') placeholderDiv!: HTMLDivElement;

  override firstUpdated(props: PropertyValues) {
    super.firstUpdated(props);
    this._notifyLoading()
  }

  override willUpdate(props: PropertyValues) {

    super.willUpdate(props);

    if (props.has('height')) {
      this.style.height = isNaN(this.height) ? this.height + '' : this.height + 'px';
    }

    if (props.has('width')) {
      this.style.width = isNaN(this.width) ? this.width + '' : this.width + 'px';
    }

  }

  override updated(props: PropertyValues) {

    super.updated(props);

    if (props.has('sizing') || props.has('position')) {
      this._transformChanged(this.sizing, this.position);
    }

    if (props.has('src') || props.has('preventLoad')) {
      this._loadStateObserver(this.src, this.preventLoad);
    }

    if (props.has('placeholder') && this.placeholderDiv) {
      this.placeholderDiv.style.backgroundImage = this.placeholder ? 'url("' + this.placeholder + '")' : '';
    }

    if (props.has('showOnHover')) {
      this._setHoverListener();
    }
  }

  private get hidePlaceholder() {
    if (this.showOnHover) {
      return false
    }
    return !this.preload || (!this.fade && !this.loading && this.loaded);
  }

  override render() {
    const ariaLabel = this.alt || (this.src === '' ? '' : this._resolveSrc(this.src).replace(/[?|#].*/g, '').split('/').pop());
    return html`
      <div id="sizedImgDiv" ?hidden=${!this.sizing} role="img" aria-label=${ifDefined(ariaLabel)}></div>
      <img id="img" alt="${this.alt || ''}" ?hidden=${!!this.sizing} crossorigin=${ifDefined(this.crossorigin)} @load=${this._imgOnLoad} @error=${this._imgOnError}>
      <div id="placeholder" ?hidden=${this.hidePlaceholder} class="${this.preload && this.fade && !this.loading && this.loaded || (this.showOnHover && !this.showPlaceholder) ? 'faded-out' : ''}"></div>`;
  }

  private _setHoverListener() {
    if (this.showOnHover) {
      this.addEventListener('mouseenter', this._showImage);
      this.addEventListener('mouseleave', this._showPlaceholder);
    } else {
      this.removeEventListener('mouseenter', this._showImage);
      this.removeEventListener('mouseleave', this._showPlaceholder);
    }
  }

  private _showImage() {
    this.showPlaceholder = false;
  }

  private _showPlaceholder() {
    this.showPlaceholder = true;
  }

  private _imgOnLoad() {
    if (this.img.src !== this._resolveSrc(this.src)) {
      return;
    }
    this.loading = false;
    this.loaded = true;
    this.error = false;
    this._notifyLoading()
  }

  private _notifyLoading() {
    this.dispatchEvent(new CustomEvent('loaded-changed', { detail: { value: this.loaded }, bubbles: true, composed: true }));
    this.dispatchEvent(new CustomEvent('loading-changed', { detail: { value: this.loading }, bubbles: true, composed: true }));
    this.dispatchEvent(new CustomEvent('error-changed', { detail: { value: this.error }, bubbles: true, composed: true }));
  }

  private _imgOnError() {
    if (this.img.src !== this._resolveSrc(this.src)) {
      return;
    }

    this.img.removeAttribute('src');
    this.imgDiv.style.backgroundImage = '';
    this.loading = false;
    this.loaded = false;
    this.error = true;
    this._notifyLoading()
  }

  private _loadStateObserver(src: string, preventLoad: boolean) {
    const newResolvedSrc = this._resolveSrc(src);
    if (newResolvedSrc === this._resolvedSrc) {
      return;
    }

    this._resolvedSrc = '';
    this.img?.removeAttribute('src');
    if (this.imgDiv) {
      this.imgDiv.style.backgroundImage = '';
    }

    if (src === '' || preventLoad) {
      this.loading = false;
      this.loaded = false;
      this.error = false;
    } else {
      this._resolvedSrc = newResolvedSrc;
      if (this.img) {
        this.img.src = this._resolvedSrc;
      }
      if (this.imgDiv) {
        this.imgDiv.style.backgroundImage = 'url("' + this._resolvedSrc + '")';
      }
      this.loading = true;
      this.loaded = false;
      this.error = false;
    }
    this._notifyLoading()
  }

  private _transformChanged(sizing: sizing, position: position) {
    const imgDivStyle = this.imgDiv?.style;
    const placeholderStyle = this.placeholderDiv?.style;

    const applyStyle = (el: HTMLDivElement['style']) => {
      if (el) {
        el.backgroundSize = sizing || '';
        el.backgroundPosition = sizing ? position : '';
        el.backgroundRepeat = sizing ? 'no-repeat' : '';
      }
    }
    applyStyle(imgDivStyle);
    applyStyle(placeholderStyle);

  }

  _resolveSrc(testSrc: string) {
    const resolved = new URL(testSrc, window.location.origin);
    return resolved.href;
  }
}

declare global {
  interface HTMLElementTagNameMap {
    'lapp-image': LappImage;
  }
}
