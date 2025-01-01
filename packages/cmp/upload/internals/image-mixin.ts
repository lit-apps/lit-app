import '@vaadin/button/vaadin-lit-button.js';
import watch from '@lit-app/shared/decorator/watch.js';
import { MixinBase, MixinReturn } from '@material/web/labs/behaviors/mixin.js';
import type { Upload } from '@vaadin/upload/src/vaadin-lit-upload.js';
import { SlotController } from '@vaadin/component-base/src/slot-controller.js';

import { css, html } from 'lit';
import { property, query, state } from 'lit/decorators.js';
import { ifDefined } from 'lit/directives/if-defined.js';
import type { position, sizing } from '../../media/image.js';
import { UploadDatabaseMixinInterface } from './database-mixin.js';
import { StorageInterface, UploadFinishedEvent } from './storage-mixin.js';
import('@lit-app/cmp/media/image')

// import('@material/web/progress/linear-progress.js')
// import('@material/web/button/filled-button.js')
type UploadControllerT = Upload & {
  _addButton: HTMLElement,
  _onAddFilesClick: (e: Event) => void,
  _onAddFilesTouchEnd: (e: Event) => void
}

class AddButtonController extends SlotController {
  constructor(public override host: UploadControllerT) {
    super(host, 'add-button', 'md-filled-button');
  }

  /**
   * Override method inherited from `SlotController`
   * to add listeners to default and custom node.
   *
   */
  override initNode(node: HTMLElement & { _isDefault?: boolean }) {
    // Needed by Flow counterpart to apply i18n to custom button
    if (node._isDefault) {
      this.defaultNode = node;
    }

    node.addEventListener('touchend', (e: Event) => {
      this.host._onAddFilesTouchEnd(e);
    });

    node.addEventListener('click', (e: Event) => {
      this.host._onAddFilesClick(e);
    });

    this.host._addButton = node;
  }
}

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

    /**
     * we cannot use `styles = [superClass.styles, css``]` as superClass.styles only has a getter
     */
    static override get styles() {
      return [
        superClass.styles,
        css`
      :host {
        display: inline-block;
        position: relative;
        --vaadin-button-background: var(--color-primary);
        --vaadin-button-text-color: var(--color-on-primary);
        --lumo-clickable-cursor: pointer;
    	}
     
      
			:host(:not([nodrop])) {
				padding: 0 !important; /* we need important as vaadin-upload theme takes precedence */
      }


      lapp-image {
        transition: all var(--time-fast, 220ms) ease-in !important;
      }
      
      :host(:not([readonly]):hover) lapp-image,
			:host(:not([readonly]):focus) lapp-image,
			:host(:not([readonly]):focus-within) lapp-image {
        transform: scale(1.02);
				filter: brightness(1.05) blur(1px);
			}

			#container {
				margin: 0;
        padding: 0;
			}

			#wrapper {
				padding: 10px 0;
				position: absolute;
				bottom: 0px;
				width: 100%;
				display: flex;
				justify-content: center;
				align-items: center;
        background-color: lch(from var(--color-inverse-surface) l c h / 0.4);
				line-height: initial;
			}

			:host([readonly]) #wrapper {
				display: none;
			}

			:host([hide-wrapper]) #wrapper {
        transition: opacity var(--time-fast, 220ms) ease-in !important;
				opacity: 0;
			}

			:host([hide-wrapper]:hover) #wrapper,
			:host([hide-wrapper]:focus) #wrapper,
			:host([hide-wrapper]:focus-within) #wrapper {
				opacity: 1;
			}

			.info {
				margin: 0;
				width: 100%;
				bottom: 0px;
				/* padding-top: 35%; */
				top: 0;
				color: white;
				background:  rgba(0,0,0,0.3);
				position: absolute;
				display: flex;
        flex-direction: column;
				justify-content: center;
				align-items: center;
			}


				[part="drop-label"] {
				 	padding: 0 !important; /* we need important as vaodin-upload theme takes precedence */
					color: var(--color-secondary-text) !important; /* we need important as vaodin-upload theme takes precedence */
				}

				:host([dragover-valid]) {
					border: 1px dashed var(--color-primary);
					transition: border-color var(--time-x-fast, 100ms);
				}

				:host([dragover-valid]) [part="drop-label"] {
					color: var(--color-primary-text);
				}

        ::slotted([slot="file-list"]) {
          position: absolute;
          top: 0px;
          left: 0;
          right: 8px;
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
					opacity: 0.2;
					transition-duration: 2s, 0.1s;
					transition-delay: 0s, 0s;
				} 
      `
      ]
    };

    declare _onFileInputChange: (e: Event) => void;
    declare _isMultiple: (maxFiles: number) => boolean;
    declare _addButtonController: AddButtonController;

    @property({ type: Number }) width = 300;
    @property({ type: Number }) height = 300;
    @property({ type: Boolean }) fade = false;
    @property() alt = '';
    @property() placeholder = '';
    @property() fallback = '';
    @property() buttonLabel = 'Upload Image ...';
    @property() dropLabel = 'Drop image here';
    @property() noFileText = 'No image uploaded yet';
    @property() position: position = 'center';
    @property() sizing: sizing = 'contain';

    @property({type: Boolean, attribute: 'hide-wrapper', reflect: true}) _hideWrapper: boolean = false;
    
    @state() error = ''
    @state() loading = false
    @state() loaded = false

    @query('#container') container!: HTMLElement;

    @watch('width') withChanged(width: number) {
      this.style.width = width + 'px';
      if (!this.container) return
      this.container.style.width = width + 'px';
    }

    @watch('height') heightChanged(height: number) {
      this.style.height = height + 'px';
      if (!this.container) return
      this.container.style.height = height + 'px';
    }

    // @watch('buttonLabel') labelChanged(label: string) {
    //   this.i18n.addFiles.one = label;
    // }
    @watch('dropLabel') dropLabelChanged(label: string) {
      this.i18n.dropFiles.one = label;
    }
    
    get hideWrapper() {
      return !!(this.src && this.loaded);
    }

    get buttonText() {
      if (this.loading) {
        return 'Loading ...';
      }
      if (this.uploading > 0) {
        return `Uploading Image ...`;
      }
      if (this.src && this.loaded) {
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
      const up = this

      this.i18n.addFiles = {
        get one() {
          if (up.loading) {
            return 'Loading ...';
          }
          if (up.uploading > 0) {
            return `Uploading Image ...`;
          }
          if (up.src && up.loaded) {
            return 'Change Image';
          }
          return up.buttonLabel;
        },
        get many() {
          return up.buttonLabel;
        }
      }
    }

    // this is an override of the method in Vaadin-upload-mixin to allow the user of md-filled-button
    setAddController() {
      this._addButtonController = new AddButtonController(this as unknown as UploadControllerT);
      this.addController(this._addButtonController);
    }


    override render() {
      const onChanged = (name: keyof this) => (e: CustomEvent) => {
        this[name] = e.detail.value;
        // this is to refresh the label
        this.i18n = { ...this.i18n };
        // this is for displaying the label
        this._hideWrapper = this.hideWrapper;
      }

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
          @error-changed=${onChanged('error')}
          @loading-changed=${onChanged('loading')}
          @loaded-changed=${onChanged('loaded')}
					src=${this.src} 
					preload 
					></lapp-image>
				<slot name="noFile">
          ${!this.src ? html`
            <div class="info">
              <div>${this.error || this.noFileText}</div>
            <div ?hidden=${this.nodrop}>
              <slot name="drop-label-icon"></slot>
              <slot name="drop-label"></slot>
            </div>
            </div>` : ''}
				</slot>
				<div part="upload-wrapper" id="wrapper">
          <slot name="add-button"></slot>
				</div>
        <slot name="file-list"></slot>
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
      this.i18n = {...this.i18n};
      this._hideWrapper = this.hideWrapper;
      this.files = [];
    }

  };
  return UploadImageMixinClass;
}

export default UploadImageMixin;

