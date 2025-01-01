import watch from '@lit-app/shared/decorator/watch.js';
import { MixinBase, MixinReturn } from '@material/web/labs/behaviors/mixin.js';
import { Upload } from '@vaadin/upload/src/vaadin-lit-upload.js';
import { css, html } from 'lit';
import { property, query, state } from 'lit/decorators.js';
import { ifDefined } from 'lit/directives/if-defined.js';
import type { position, sizing } from '../../media/image.js';
import { UploadDatabaseMixinInterface } from './database-mixin.js';
import { StorageInterface, UploadFinishedEvent } from './storage-mixin.js';
import('@lit-app/cmp/media/image')

import('@material/web/progress/linear-progress.js')
import('@material/web/button/filled-button.js')



export declare class UploadImageMixinInterface {
  width: number
  height: number
  buttonLabel: string

  /**
   * A short text alternative for the image.
   */
  alt: string

  /**
   * Sets a sizing option for the image.  Valid values are `contain` (full
   * aspect ratio of the image is contained within the element and
   * letterboxed) or `cover` (image is cropped in order to fully cover the
   * bounds of the element), or `null` (default: image takes natural size).
   */
  sizing: sizing

  /**
   * When a sizing option is used (`cover` or `contain`), this determines
   * how the image is aligned within the element bounds.
   */
  position: position

  /**
   * This image will be used as a background/placeholder until the src image
   * has loaded.  Use of a data-URI for placeholder is encouraged for instant
   * rendering.
   */
  placeholder: string

  /**
   * When `preload` is true, setting `fade` to true will cause the image to
   * fade into place.
   */
  fade: boolean

  /**
   * Read-only value that indicates that the last set `src` failed to load.
   */
  error: string

  /*
   * `fallback` will take this as the source for image. 
   * Difference with `placeholder` is that when fallback is set, image is not considered as empty
   */
  fallback: string

  /*
   * `noFileText` text when there is no file
   */
  noFileText: string
}

type BaseT = Upload & StorageInterface & UploadDatabaseMixinInterface;
/**
 * UploadImageMixin  
 */
export const UploadImageMixin = <T extends MixinBase<BaseT> & { styles?: any }>(
  superClass: T
): MixinReturn<T, UploadImageMixinInterface> => {


  abstract class UploadImageMixinClass extends superClass {

    static override _styles = [
      superClass.styles,
      css`
      :host {
      	display: inline-block;
    	}
     
     
			:host(:not([nodrop])) {
				padding: 0 !important; /* we need important as vaodin-upload theme takes precedence */
      }

			lapp-image {
				transition: transform var(--time-fast, 220ms) ease-in;
			}

			:host(:not([readonly]):hover) lapp-image,
			:host(:not([readonly]):focus) lapp-image {
				transform: scale(1.02);
				filter: brightness(1.05) blur(1px);
			}

			#container {
				margin: auto;
				position: relative;
				line-height: 0;
			}

			#wrapper {
				padding: 10px 0;
				position: absolute;
				bottom: 0;
				width: 100%;
				display: flex;
				justify-content: center;
				align-items: center;
				background-color: rgba(128, 128, 128, .5);
				transition: opacity var(--time-fast, 220ms) ease-in;
				line-height: initial;
			}

			:host([readonly]) #wrapper {
				display: none;
			}

			:host([hide-wrapper]) #wrapper {
				opacity: 0;
			}

			:host([hide-wrapper]:hover) #wrapper,
			:host([hide-wrapper]:focus) #wrapper {
				opacity: 1;
			}

			.info {
				margin: 0;
				width: 100%;
				bottom: 0;
				padding-top: 35%;
				top: 0;
				color: white;
				background:  rgba(0,0,0,0.3);
				position: absolute;
				display: flex;
				justify-content: center;
				align-items: center;
			}

			md-linear-progress {
				position: absolute;
				width: 100%;
				bottom: 0px;
			}

				[part="drop-label"] {
				 	padding: 0 !important; /* we need important as vaodin-upload theme takes precedence */
					color: var(--color-secondary-text) !important; /* we need important as vaodin-upload theme takes precedence */
				}

				:host([dragover-valid]) {
					border: 1px dashed var(--color-primary);
					/*border-color: var(--material-primary-color);*/
					transition: border-color var(--time-x-fast, 100ms);
				}

				:host([dragover-valid]) [part="drop-label"] {
					color: var(--color-primary-text);
				}


				/* Ripple */
				:host::before {
					content: "";
					position: absolute;
					width: 100px;
					height: 100px;
					border-radius: 50%;
					top: 50%;
					left: 50%;
					pointer-events: none;
					background-color: var(--color-primary);
					opacity: 0;
					transform: translate(-50%, -50%) scale(0);
					transition: transform 0s cubic-bezier(.075, .82, .165, 1), opacity var(--time-slow, 400ms) linear;
					transition-delay: var(--time-fast, 220ms), 0s;
				}

				:host([dragover-valid])::before {
					transform: translate(-50%, -50%) scale(10);
					opacity: 0.1;
					transition-duration: 2s, 0.1s;
					transition-delay: 0s, 0s;
				}
      `
    ];

    declare _onFileInputChange: (e: Event) => void;
    declare _isMultiple: (maxFiles: number) => boolean;

    @property({ type: Number }) width = 300;
    @property({ type: Number }) height = 300;
    @property({ type: Boolean }) fade = false;
    @property() alt = '';
    @property() placeholder = '';
    @property() fallback = '';
    @property() buttonLabel = 'Upload Image';
    @property() noFileText = 'No image uploaded yet';
    @property() position: position = 'center';
    @property() sizing: sizing = 'contain';

    @state() error = ''
    @state() loading = false
    @state() loaded = false
    @state() _src = ''

    @query('#container') container!: HTMLElement;
    @query('#wrapper') wrapper!: HTMLElement;

    @watch('width') withChanged(width: number) {
      if (!this.container || !this.wrapper) return 
      this.container.style.width = width + 'px';
      this.wrapper.style.width = width + 'px';
    }
    @watch('height') heightChanged(height: number) {
      if (!this.container || !this.wrapper) return 
      this.container.style.height = height + 'px';
      this.wrapper.style.height = height + 'px';
    }

    get buttonText() {
      if (this.loading) {
        return 'Loading ...';
      }
      if (this.uploading > 0) {
        return `Uploading Image ...`;
      }
      if (this._src && this.loaded) {
        return 'Change Image';
      }
      return this.buttonLabel;
    }

    get src() {
      return this.metaData?.url || this.fallback;
    }
    constructor(...args: any[]) {
      super(...args);
      this.maxFiles = 1;
      this.accept = 'image/*';
    }
    override render() {
      return html`
      <div part="drop-label" id="container">
				<lapp-image id="img" 
					.width=${this.width} 
					.height=${this.height} 
          alt="${this.alt}"
          .fade=${this.fade}
					placeholder=${this.placeholder}
          .position=${this.position}
          .sizing=${this.sizing} 
          @error-changed=${(e: CustomEvent) => this.error = e.detail.value}
          @loading-changed=${(e: CustomEvent) => this.loading = e.detail.value}
          @loaded-changed=${(e: CustomEvent) => this.loaded = e.detail.value}
					src=${this.src} 
					preload 
					></lapp-image>
				<slot name="error">
          ${this.error ? html`<p class="info">${this.error}</p>` : ''}
				</slot>
				<slot name="noFile">
          ${!this.src ? html`<p class="info">${this.noFileText}</p>` : ''}
				</slot>
				<div part="upload-wrapper" id="wrapper">
          ${this.readonly ?
          '' :
          html`<md-filled-button 
							part="upload-button" 
							id="addButton" 
							@click=${this._onAddFilesClick} 
							>${this.buttonLabel}</md-filled-button>`}
            ${this.uploading > 0 ? html`<md-linear-progress indeterminate aria-label="uploading"></md-linear-progress>` : ''}
					</template>
				</div>
			</div>
      <input
        type="file"
        id="fileInput"
        hidden
        @change="${this._onFileInputChange}"
        accept="${this.accept}"
        ?multiple="${this._isMultiple(this.maxFiles)}"
        capture="${ifDefined(this.capture || undefined)}"
      />
      `;
    }
    // Note(cg): we override to allow changing file even if maxFiles is reached.
    _onAddFilesClick(e: Event) {
      this.files = [];
      // @ts-expect-error - _onAddFilesClick is private
      super._onAddFilesClick(e)
    }

    override uploadFinished(e: UploadFinishedEvent) {
      // Note(cg): reset files list so that we can change again.
      super.uploadFinished(e);
      this.files = [];
    }

  };
  return UploadImageMixinClass;
}

export default UploadImageMixin;

